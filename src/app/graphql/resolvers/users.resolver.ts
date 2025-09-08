import {  Query, Resolver,  Mutation, UseMiddleware, Args, Ctx } from 'type-graphql';
import { GraphQLError } from 'graphql';
import { UserService } from '../../service/user.service.js';
import * as auth from '../../middleware/auth.js';
import {Inject, Service} from "typedi"
import { GetUserArgs, Register, UpdateUserArgs } from '../../../types/params/user.params.js';
import { Pagination } from '../../../types/params/general.params.js';
import { PersonalResponse, UserPaginatedResponse } from '../../../types/object/user.object.js';
import { ResponseObject } from '../../../types/object/response.object.js';
import type { AuthContext } from 'src/app/context/AppContext.js';

@Service()
@Resolver()
export class UserResolver {
  @Inject(() => UserService)
  private userService!: UserService;

  @Query(() => [UserPaginatedResponse])
  @UseMiddleware(auth.AuthMiddleware)
  async users(
   @Args(() => Pagination) { limit, offset }: Pagination
  ): Promise<UserPaginatedResponse> {
    try {
      const users = await this.userService.getAll(limit, offset);
      return {
        total: users.length,
        data: users
      };

      }
    catch (error) {
      throw new GraphQLError("Gagal mengambil data users", {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          originalError: error instanceof Error ? error.message : "Unknown error"
        }
      });
    }
  }

  @Query(() => PersonalResponse)
  async personal(
    @Args(() => GetUserArgs) user:GetUserArgs
  ):Promise<PersonalResponse> {
    try{
      const users = await this.userService.person(user);

      return {
        message: "User found",
        success: true,
        data: users
      }
    }catch(error){
      throw new GraphQLError("Gagal mengambil data user", {
        extensions: {
          code: 'NOT_FOUND',
          originalError: error instanceof Error ? error.message : "User not found"
        }
      });
  }
}

  @Mutation(() => ResponseObject)
  async Register(
    @Args(() => Register) userInput: Register,
  ): Promise<ResponseObject> {
    try {
      await this.userService.create(userInput);

      return {
        message: "User created successfully",
        success: true,
      };
    } catch (error) {
      console.error("Error in Register resolver:", error);
      throw new GraphQLError(`Gagal membuat user: ${error instanceof Error ? error.message : "Unknown error"}`, {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          originalError: error instanceof Error ? error.message : "Unknown error"
        }
      });
    }
  }

  @Mutation(() => ResponseObject)
  @UseMiddleware(auth.AuthMiddleware)
  async updateProfile(
    @Args(() => UpdateUserArgs) user: UpdateUserArgs,
    @Ctx() context: AuthContext
  ): Promise<ResponseObject> {
    try {
      

      const updatedUser = await this.userService.updateProfile(user, context.user!.userId);
      return {
        message: "Profile updated successfully",
        success: true,
        data: JSON.stringify(updatedUser)
      };
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }
      throw new GraphQLError("Gagal mengupdate profile", {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          originalError: error instanceof Error ? error.message : "Unknown error"
        }
      });
    }
  }

}

