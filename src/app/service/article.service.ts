import { Inject, Service } from "typedi";
import { ArticleRepository } from "../../database/repositories/article.repository.js";
import { ArticleInputArgs } from "../../types/params/article.params.js";
import { Article } from "@database/entities/Article.js";
import { FileUploadService } from "./file-upload.service.js";
import { FileUpload } from "graphql-upload-ts";

@Service()
export class ArticleService{
    constructor(
        @Inject("ArticleRepository")
        private readonly articleRepository: ArticleRepository,

        @Inject(() => FileUploadService)
        private readonly fileUploadService: FileUploadService
    ) {}


    async getById(id: string){
        return this.articleRepository.findById(id);
    }

    async uploadImageArticle(image:FileUpload, authorId:string, articleId:string):Promise<string>{
        try{
            
        const article = await Article.findOne({where:{id:articleId, authorId:authorId}})
        
        if(!article){
            throw new Error("Article not found or you are not the author");
        }

        const uploadArticleOptions = this.fileUploadService.UploadForArticle(authorId, articleId)


        const responseUpload = await this.fileUploadService.upload(image, uploadArticleOptions);

        if(!responseUpload){
            throw new Error("Failed to upload article image");
        }

        article.image = responseUpload.fileUrl;
        await article.save()

        return responseUpload.fileUrl;

        }catch(error){
            if (error instanceof Error) {
                throw Error(`Failed to upload article image: ${error.message}`);
            }
            return "Failed to upload article image";
        }
    }
    
    async create(data: ArticleInputArgs): Promise<Article> {
        try{

            // const {image , ...articleref} = data;

            // const imageUrl = typeof image === "string";

            // const articleData = {
            //     ...articleref,
            //     ...(image !== undefined ? { image: imageUrl } : {image: ''})
            // }

            const article = await this.articleRepository.create(data)

            return article;
            

          
        }catch(error){
            if (error instanceof Error) {
                throw Error(`Failed to create article: ${error.message}`);
            } else {
                throw Error(`Failed to create article: ${String(error)}`);
            }
        }
    }

}