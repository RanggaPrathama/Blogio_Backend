import { UserRepository } from "../../database/repositories/UserRepository.js";
import { User } from "../../types/object/user.object.js";
import { GraphQLError } from "graphql";
import { logger } from "../../utils/fileLogger.js";
import { Service, Inject } from "typedi";
import { GetUserArgs, Register, UpdateUserArgs } from "../../types/params/user.params.js";

@Service()
export class UserService {
  // constructor(
  //   @Inject(() => UserRepository)
  //  private readonly userRepository: UserRepository
  // ) {

  // }

  @Inject(() => UserRepository)
  private userRepository!: UserRepository;

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new GraphQLError("User tidak ditemukan", {
        extensions: {
          code: "NOT_FOUND",
          resource: "User",
        },
      });
    }
    return user;
  }

  async getByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new GraphQLError("User dengan username tersebut tidak ditemukan", {
        extensions: {
          code: "NOT_FOUND",
          resource: "User",
          field: "username",
        },
      });
    }
    return user;
  }

  async getAll(limit: number, offset: number): Promise<User[]> {
    try {
      console.info(`INFO IN SERVICE ${limit} ${offset}`);
      return await this.userRepository.findAll(limit, offset);
    } catch (error) {
      logger.error("Error getting all users", { error });
      throw new GraphQLError("Gagal mengambil data users", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new GraphQLError("User dengan email tersebut tidak ditemukan", {
        extensions: {
          code: "NOT_FOUND",
          resource: "User",
          field: "email",
        },
      });
    }
    return user;
  }

  async create(userData: Register): Promise<void> {
    try {
      console.log("UserService.create called with:", {
        ...userData,
        password: "[HIDDEN]",
      });

      const existingByUsername = await this.userRepository.findByUsername(
        userData.username
      );
      if (existingByUsername) {
        throw new GraphQLError("Username sudah digunakan", {
          extensions: {
            code: "BAD_USER_INPUT",
            field: "username",
          },
        });
      }

      const existingByEmail = await this.userRepository.findByEmail(
        userData.email
      );
      if (existingByEmail) {
        throw new GraphQLError("Email sudah digunakan", {
          extensions: {
            code: "BAD_USER_INPUT",
            field: "email",
          },
        });
      }

      console.log("Creating user in repository...");

      await this.userRepository.create(userData);
    } catch (error) {
      console.error("Error in UserService.create:", error);
      if (error instanceof GraphQLError) {
        throw error;
      }

      logger.error("Error creating user", {
        error: error instanceof Error ? error.message : String(error),
        userData: { ...userData, password: "[HIDDEN]" },
      });

      throw new Error(
        `Gagal membuat user: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async person(user: GetUserArgs): Promise<User> {
    try {
      if (
        (!user.id || user.id === "") &&
        (!user.username || user.username === "")
      ) {
        throw new Error("Undefined User Request");
      }

      let users: User;

      if (user.id === "" || user.id === undefined) {
        users = await this.getByUsername(user.username!);
      } else {
        users = await this.getById(user.id!);
      }

      return users;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async updateProfile(updateData: UpdateUserArgs, userId:string): Promise<User> {
    try {
      const existingUser = await this.userRepository.findById(userId);
      if (!existingUser) {
        throw new GraphQLError("User tidak ditemukan", {
          extensions: {
            code: "NOT_FOUND",
            resource: "User",
          },
        });
      }

      // Update user data
      const updatedUser = await this.userRepository.update(updateData, userId);

      logger.info("User profile updated successfully", {
        userId: updatedUser.id,
        updatedFields: Object.keys(updateData),
      });

      return updatedUser;
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }

      throw new GraphQLError("Gagal mengupdate profile user", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }
  }
}
