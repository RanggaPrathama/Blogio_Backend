import { Arg, Args, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Inject, Service } from "typedi";
import { ArticleService } from "../../service/article.service.js";
import { ResponseObject } from "@object/response.object.js";
import { ArticleInputArgs } from "../../../types/params/article.params.js";
import {GraphQLUpload, type FileUpload } from "graphql-upload-ts";
import type { AuthContext } from "src/app/context/AppContext.js";
import { AuthMiddleware } from "src/app/middleware/auth.js";

@Service()
@Resolver()
export class ArticleResolver{   
    constructor(
        @Inject(()=>ArticleService)
        private readonly articleService: ArticleService
    ){}


    // @Query(()=>Article)
    // async getArticleById(
    //    @Arg("id", () => String) id: string
    // ): Promise<Article | null> {
    //     try{
    //         const article = await this.articleService.getById(id);
           
    //         return article;
    //     }catch(error){
    //         if (error instanceof Error) {
    //             throw new Error(`Failed to fetch article ${error.message}`);
    //         }
    //         throw new Error("Failed to fetch article: Unknown error");
    //     }
    // }

@UseMiddleware(AuthMiddleware)
@Mutation(()=>ResponseObject)
    async createArticle(
        @Args(()=>ArticleInputArgs) articleInput:ArticleInputArgs,
        @Ctx() ctx: AuthContext,
    ){
        try{
            const userId = ctx.user!.userId

            const payload = {
                ...articleInput,
                authorId: userId
            }

            const article = await this.articleService.create(payload);
            return {
                success: true,
                message: "Article created successfully",
                data: article
            };
        }catch(error){
            if (error instanceof Error) {
                throw new Error(`Failed to create article ${error.message}`);
            }
            throw new Error("Failed to create article: Unknown error");
        }
    }


@UseMiddleware(AuthMiddleware)
@Mutation(()=>ResponseObject)
    async uploadImageArticle(
        @Arg("input", () => GraphQLUpload) image: FileUpload,
        @Arg("articleId", () => String) articleId: string,
        @Ctx() ctx: AuthContext
    ): Promise<ResponseObject> {
        try {
            const result = await this.articleService.uploadImageArticle(image, ctx.user!.userId, articleId);

            return {
                success: true,
                message: "Image uploaded successfully",
                data: result.valueOf()
            }
        }catch(error){
            if (error instanceof Error) {
                throw new Error(`Failed to upload article image ${error.message}`);
            }

            throw new Error("Failed to upload article image: Unknown error");
        }
    }

}