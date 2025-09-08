import { ArgsType, Field} from "type-graphql";
import { Pagination } from "./general.params.js";
import { ArticleStatus } from "@database/entities/Article.js";
// import {  GraphQLUpload } from "graphql-upload-ts";
// import type { FileUpload } from "graphql-upload-ts";

@ArgsType()
export class Articles {
    @Field(() => Pagination, { nullable: true })
    pagination?: Pagination;

}

@ArgsType()
export class ArticleInputArgs {
    @Field(()=>String)
    title!: string;

    @Field(()=>String)
    content!: string;

    @Field(()=>String)
    authorId!: string;

    // @Field(() => GraphQLUpload, { nullable: true })
    // image?: FileUpload;
    
    @Field(()=> String, { nullable: true })
    image?: string

    @Field(() => ArticleStatus, { nullable: true })
    status?: ArticleStatus;

    @Field(() => [String], { nullable: true })
    tagIds?: string[];
}

