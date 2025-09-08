import { UserRepository } from '@/database/repositories/UserRepository.js';
import { logger } from '../../utils/fileLogger.js';
import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import { JsonWebToken } from '../../utils/jwt.js';
import {LoginInputArgs} from '../../types/params/index.js'
import { Inject, Service } from 'typedi';

@Service()
export class LoginService {
  
  @Inject(() => UserRepository)
  private userRepository!: UserRepository;

  async execute(
    { email, password }: LoginInputArgs,
   
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {

      const user = await this.userRepository.findByEmail(email);
        if (!user) {
          logger.warning(`[USE_CASE] Login failed: User not found`, { email });
          throw new GraphQLError('Email Anda Salah', {
            extensions: {
              code: 'UNAUTHENTICATED'
            }
          });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password || '');
        if (!isPasswordValid) {
          logger.warning(`[USE_CASE] Login failed: Invalid password`, { email });
          throw new GraphQLError('Email atau password salah', {
            extensions: {
              code: 'UNAUTHENTICATED'
            }
          });
        }

        const AccessToken = JsonWebToken.sign(user, true);
        const RefreshToken = JsonWebToken.sign(user, false);

        if (!AccessToken || !RefreshToken) {
          logger.warning(`[USE_CASE] Login failed: Token generation failed`, { userId: user.id, email });
          throw new GraphQLError('Terjadi kesalahan saat membuat token', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR'
            }
          });
        }
        

        logger.info(`[USE_CASE] Login successful`, { userId: user.id, email });

        return { accessToken: AccessToken, refreshToken: RefreshToken };

    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error; 
      }
      
      logger.error(`[USE_CASE] Unexpected error during login`, { error, email });
      throw new GraphQLError('Terjadi kesalahan sistem', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          layer: 'USE_CASE'
        }
      });
    }
  }

  async refreshToken(oldRefreshToken: string): Promise<{ accessTokens: string; refreshTokens: string }> {
    try{
      const decodedRefreshToken = JsonWebToken.verify(oldRefreshToken, false)
      if(!decodedRefreshToken) throw new GraphQLError("Invalid refresh token", {
        extensions:{
          code: "UNAUTHENTICATED"
        }
      });
      const user = await this.userRepository.findById(decodedRefreshToken.userId);
      
      if(!user) throw new GraphQLError("User not found", {
        extensions:{
          code: "UNAUTHENTICATED"
        }
      });

      const accessTokens = JsonWebToken.sign(user, true);
      const refreshTokens = JsonWebToken.sign(user, false);

      if(!accessTokens || !refreshTokens) throw new GraphQLError("Token generation failed", {
        extensions:{
          code: "INTERNAL_SERVER_ERROR"
        }
      });

      return {accessTokens, refreshTokens};
    }catch(error){
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError('Terjadi kesalahan sistem', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          layer: 'USE_CASE'
        }
      });
    }
  }

  
}
