import { Field, ObjectType } from "type-graphql";
import { PaginatedResponse, SingleResponse } from "./response.object.js";

@ObjectType()
export class User {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  username!: string;

  @Field(() => String, {nullable: true})
  password?: string;

  @Field(() => String, { nullable: true })
  bio?: string;
}

@ObjectType()
export class LoginResponse {
  @Field(() => String)
  message!: string;

  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String)
  token!: string;

  @Field(() => String)
  refreshToken!: string;
}

@ObjectType()
export class PersonalResponse extends SingleResponse(User) {}

@ObjectType()
export class UserPaginatedResponse extends PaginatedResponse(User) {}
