import { AuthCheckerInterface, MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { GraphQLError } from 'graphql';
import { JsonWebToken } from '../../utils/jwt.js';
import { AuthError } from 'src/types/errors/graphql.js';
import { AuthContext } from '../context/AppContext.js';
import { Service } from 'typedi';

@Service()
export class AuthMiddleware implements MiddlewareInterface<AuthContext> {
  async use({ context }: ResolverData<AuthContext>, next: NextFn) {
    try {
      const authorization = context.req.headers.authorization;
      const token = JsonWebToken.extractBearerToken(authorization);

      if (!token) {
        throw new GraphQLError('Authentication required', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        });
      }

      // Verify token dan tambahkan user ke context
      const Accessuser = JsonWebToken.verify(token, true);
      context.user = Accessuser;

      return next();
    } catch (error) {
      // Jika error dari JWT verify, throw ulang
      if (error instanceof GraphQLError) {
        throw error;
      }

      // Error lainnya
      throw new GraphQLError('Authentication failed', {
        extensions: {
          code: 'AUTHENTICATION_FAILED',
          http: { status: 401 },
        },
      });
    }
  }
}


/**
 * Guards user authentication
 */
@Service()
export class AuthChecker implements AuthCheckerInterface<AuthContext> {
  
  async check({context}: ResolverData<AuthContext>, roles: string[]): Promise<boolean> {

    const authorization = context.req.headers.authorization;
    const token = JsonWebToken.extractBearerToken(authorization);
    if(!token) throw new AuthError('Authentication required');

    

    const Accessuser = JsonWebToken.verify(token, true);

    context.user = Accessuser

    if(roles.length === 0 ) return true

    

    return true;

  }
}