import { ObjectType, Field } from "type-graphql";


@ObjectType()
export class Tag{
    @Field(()=>String)
    id!: string;

    @Field(()=>String)
    name!: string;

    @Field(()=>Date)
    createdAt!: Date;

    @Field(()=>Date)
    updatedAt!: Date;
}