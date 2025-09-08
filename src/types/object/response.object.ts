import { ClassType, Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class ResponseObject{
    @Field(()=>String)
    message!: string;

    @Field(()=>Boolean)
    success!: boolean;

    @Field(() => String, { nullable: true })
    data?: string;
}

export function PaginatedResponse<TItem extends object>(TItemClass: ClassType<TItem>){
    @ObjectType()
    class PaginatedResponseClass {

        @Field(() => Int)
        total!: number;

        
        @Field(() => [TItemClass])
        data!: TItem[];
    }

    return PaginatedResponseClass;
}

export function SingleResponse<TItem extends object>(TItemClass: ClassType<TItem>) {
    @ObjectType()
    class SingleResponseClass {

        @Field(() => String)
        message!: string;

        @Field(() => Boolean)
        success!: boolean;

        @Field(() => TItemClass, { nullable: true })
        data?: TItem;
    }

    return SingleResponseClass;
}