import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class TagInputArgs {
    @Field(() => String)
    name!: string;

    @Field(() => String)
    description!: string;
}