import { MaxLength, MinLength } from "class-validator";
import { ArgsType, Float, Field } from "type-graphql";

@ArgsType()
export class Pagination {
    @Field(() => Float)
    @MinLength(1, {message:"Min Length of Limit is 1"})
    @MaxLength(1000,{message:"Max Length of Limit is 1000"})
    limit!: number;

    @Field(() => Float)
    offset!: number;
}