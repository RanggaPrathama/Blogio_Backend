import { Field, ObjectType } from "type-graphql";
import { User } from "./user.object.js";
import { Tag } from "./tag.object.js";
// import { Tag } from "../../database/entities/Tags.js";
// import { User } from "@database/entities/User.js";


@ObjectType()
export class Article {
    @Field()
    id!: string;

    @Field()
    title!: string;

    @Field()
    content!: string;

    @Field()
    author!: User;

    @Field()
    tag!: Tag[];

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;
}