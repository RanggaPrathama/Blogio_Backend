import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { Service } from 'typedi';

interface DecodedToken {
  sub: string;
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
  exp: number;
  iat: number;
  iss: string;
  aud: string | string[];
}

@Service()
export class TokenVerificationService {
  private jwksClient: jwksClient.JwksClient;

  constructor() {
    this.jwksClient = jwksClient({
      jwksUri: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 600000, // 10 menit
    });
  }

  private getSigningKey = (kid: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      this.jwksClient.getSigningKey(kid, (err, key) => {
        if (err) {
          reject(err);
        } else {
          const signingKey = key?.getPublicKey();
          resolve(signingKey as string);
        }
      });
    });
  };

  async verifyToken(token: string): Promise<DecodedToken> {
    try {
      // Decode token header untuk mendapatkan kid
      const decoded = jwt.decode(token, { complete: true });
      
      if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new Error('Invalid token format - missing kid in header');
      }

      // Dapatkan public key dari JWKS endpoint
      const signingKey = await this.getSigningKey(decoded.header.kid);

      // Verify token dengan public key (RSA256)
      const verified = jwt.verify(token, signingKey, {
        algorithms: ['RS256'],
        issuer: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,
        audience: process.env.KEYCLOAK_CLIENT_ID,
      }) as DecodedToken;

      return verified;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error(`JWT verification failed: ${error.message}`);
      } else if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      } else if (error instanceof jwt.NotBeforeError) {
        throw new Error('Token not active yet');
      } else {
        throw new Error(`Token verification failed: ${error}`);
      }
    }
  }

  async extractUserFromToken(token: string): Promise<{
    id: string;
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
  }> {
    const decoded = await this.verifyToken(token);
    
    const result: {
      id: string;
      email?: string;
      username?: string;
      firstName?: string;
      lastName?: string;
      roles: string[];
    } = {
      id: decoded.sub,
      roles: [
        ...(decoded.realm_access?.roles || []),
        ...(Object.values(decoded.resource_access || {}).flatMap(resource => resource.roles || []))
      ]
    };

    if (decoded.email) result.email = decoded.email;
    if (decoded.preferred_username) result.username = decoded.preferred_username;
    if (decoded.given_name) result.firstName = decoded.given_name;
    if (decoded.family_name) result.lastName = decoded.family_name;

    return result;
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as DecodedToken;
      if (!decoded || !decoded.exp) {
        return true;
      }
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }
}
