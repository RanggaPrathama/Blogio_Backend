import { Service, Inject } from 'typedi';
import { GraphQLError } from 'graphql';
import KcAdminClient from "@keycloak/keycloak-admin-client";
import { TokenVerificationService } from './TokenVerificationService.js';

interface UserRegistrationData {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  user: {
    id: string;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
  };
}

@Service()
export class KeycloakAuthService {
  private kcAdminClient: KcAdminClient;

  constructor(
    @Inject() private tokenVerificationService: TokenVerificationService
  ) {
    this.kcAdminClient = new KcAdminClient({
      baseUrl: process.env.KEYCLOAK_URL!,
      realmName: process.env.KEYCLOAK_REALM!,
    });
  }

  private async authenticateAdmin(): Promise<void> {
    await this.kcAdminClient.auth({
      username: process.env.KEYCLOAK_ADMIN_USERNAME!,
      password: process.env.KEYCLOAK_ADMIN_PASSWORD!,
      grantType: 'password',
      clientId: 'admin-cli',
    });
  }

  async registerUser(userData: UserRegistrationData): Promise<{ id: string; message: string }> {
    try {
      await this.authenticateAdmin();

      // Cek apakah user sudah ada
      const existingUsers = await this.kcAdminClient.users.find({
        username: userData.username,
        realm: process.env.KEYCLOAK_REALM,
      });

      if (existingUsers.length > 0) {
        throw new GraphQLError('Username already exists', {
          extensions: {
            code: 'USER_EXISTS',
            http: { status: 409 }
          }
        });
      }

      // Cek email jika ada
      if (userData.email) {
        const existingEmailUsers = await this.kcAdminClient.users.find({
          email: userData.email,
          realm: process.env.KEYCLOAK_REALM,
        });

        if (existingEmailUsers.length > 0) {
          throw new GraphQLError('Email already exists', {
            extensions: {
              code: 'EMAIL_EXISTS',
              http: { status: 409 }
            }
          });
        }
      }

      // Buat user baru
      const createdUser = await this.kcAdminClient.users.create({
        realm: process.env.KEYCLOAK_REALM,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        enabled: true,
        emailVerified: false,
        credentials: [
          {
            type: 'password',
            value: userData.password,
            temporary: false,
          },
        ],
      });

      return {
        id: createdUser.id!,
        message: 'User registered successfully'
      };
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError(`Registration failed: ${error}`, {
        extensions: {
          code: 'REGISTRATION_FAILED',
          http: { status: 400 }
        }
      });
    }
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const tokenUrl = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;
      
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: process.env.KEYCLOAK_CLIENT_ID!,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new GraphQLError(`Login failed: ${errorData.error_description || 'Invalid credentials'}`, {
          extensions: {
            code: 'LOGIN_FAILED',
            http: { status: 401 }
          }
        });
      }

      const tokenData = await response.json();

      // Verify dan extract user data dari token menggunakan JWKS
      const userData = await this.tokenVerificationService.extractUserFromToken(tokenData.access_token);

      return {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
        refreshExpiresIn: tokenData.refresh_expires_in,
        user: userData
      };
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError(`Login failed: ${error}`, {
        extensions: {
          code: 'LOGIN_FAILED',
          http: { status: 401 }
        }
      });
    }
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
  }> {
    try {
      const tokenUrl = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;
      
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: process.env.KEYCLOAK_CLIENT_ID!,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new GraphQLError(`Token refresh failed: ${errorData.error_description || 'Invalid refresh token'}`, {
          extensions: {
            code: 'REFRESH_FAILED',
            http: { status: 401 }
          }
        });
      }

      const tokenData = await response.json();

      return {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || refreshToken,
        expiresIn: tokenData.expires_in,
        refreshExpiresIn: tokenData.refresh_expires_in,
      };
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError(`Token refresh failed: ${error}`, {
        extensions: {
          code: 'REFRESH_FAILED',
          http: { status: 401 }
        }
      });
    }
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    try {
      const logoutUrl = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/logout`;
      
      const response = await fetch(logoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.KEYCLOAK_CLIENT_ID!,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        console.warn('Logout warning:', await response.text());
      }

      return { message: 'Logout successful' };
    } catch (error) {
      console.warn('Logout error:', error);
      return { message: 'Logout completed' };
    }
  }

  async verifyToken(token: string): Promise<{
    valid: boolean;
    user?: {
      id: string;
      email?: string;
      username?: string;
      firstName?: string;
      lastName?: string;
      roles: string[];
    };
    error?: string;
  }> {
    try {
      const userData = await this.tokenVerificationService.extractUserFromToken(token);
      return {
        valid: true,
        user: userData
      };
    } catch (error) {
      return {
        valid: false,
        error: `${error}`
      };
    }
  }
}
