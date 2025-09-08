import { Args, Authorized, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { TagService } from "../../service/tag.service.js";
import { Tag } from "../../../types/object/tag.object.js";
import { TagInputArgs } from "src/types/params/tags.params.js";
import {Container, Inject, Service } from "typedi";
import { AuthMiddleware } from "src/app/middleware/auth.js";

@Service()
@Resolver()
export class TagResolver {

  @Inject(() => TagService)
  private tagUserService!: TagService

  // constructor(){
  //   this.tagUserService = Container.get(TagService);
  // }
  
  @Query(() => [Tag])
  @Authorized()
  async tags(): Promise<Tag[]> {
    return await this.tagUserService.getAll();
  }

  @Mutation(() => Tag)
  @UseMiddleware(AuthMiddleware)
  async createTag(
    @Args(() => TagInputArgs) tagInput: TagInputArgs
  ): Promise<Tag | undefined> {
    try {
      return await this.tagUserService.create(tagInput);
    } catch (error) {
      console.error(error);
      throw new Error(
        "Failed to create tag" +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }
}
