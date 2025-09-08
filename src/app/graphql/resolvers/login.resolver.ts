import { LoginInputArgs } from "../../../types/params/user.params.js";
import { logger } from "../../../utils/fileLogger.js";
import { GraphQLError } from "graphql";
import { LoginService } from "../../service/login.service.js";
import { Args, Ctx, Mutation, Resolver } from "type-graphql";
import { Inject, Service } from "typedi";
import { LoginResponse } from "@/types/object/index.js";
import type { AuthContext } from "src/app/context/AppContext.js";

@Service()
@Resolver()
export class LoginResolver {
  
  @Inject(() => LoginService)
  private LoginService!: LoginService

  @Mutation(() => LoginResponse)
  async Login(
    @Args(() => LoginInputArgs) input: LoginInputArgs,
    @Ctx() ctx: AuthContext
  ): Promise<LoginResponse> {
    try {
      const { accessToken, refreshToken } = await this.LoginService.execute(input);

      if (!accessToken) {
        throw new GraphQLError("Login failed", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      ctx.cookies?.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return {
        message: "Login successful",
        success: true,
        token: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error(`[RESOLVER] Unexpected error`, { error: errorMessage });
      throw new GraphQLError("Terjadi kesalahan internal, coba lagi nanti", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  @Mutation(()=> LoginResponse)
  async RefreshToken(
    @Ctx() ctx: AuthContext):Promise<LoginResponse>{
      try{
        const refreshToken = ctx.cookies?.get('refreshToken');
        if(!refreshToken) throw new GraphQLError("Refresh token not found", {
          extensions:{
            code: "UNAUTHENTICATED"
          }
        });

        const {accessTokens, refreshTokens} = await this.LoginService.refreshToken(refreshToken);

        return {
          message: "Token refreshed successfully",
          success: true,
          token: accessTokens,
          refreshToken: refreshTokens
        }

      }catch(error){
        if( error instanceof GraphQLError) {
          throw error;
        }
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        logger.error(`[RESOLVER] Unexpected error during token refresh`, { error: errorMessage });
        throw new GraphQLError("Terjadi kesalahan internal, coba lagi nanti", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        });
      }
    }
  


  // @Mutation(()=>ResponseObject)
  // async LoginKeycloak(
  //   @Arg("input") input:{username:string, password:string}
  // ):Promise<ResponseObject>{
  //   try {
  //     const tokenResponse = await this.authKeycloak.LoginUser(input.username, input.password);
  //     return {
  //       message: "Login successful",
  //       success: true,
  //       data: tokenResponse
  //     };
  //   } catch (error) {
  //     if (error instanceof GraphQLError) {
  //       throw error;
  //     }

  //     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  //     logger.error(`[RESOLVER] Unexpected error`, { error: errorMessage });
  //     throw new GraphQLError('Terjadi kesalahan internal, coba lagi nanti', {
  //       extensions: {
  //         code: 'INTERNAL_SERVER_ERROR',
  //       },
  //     });
  //   }
  // }
}
