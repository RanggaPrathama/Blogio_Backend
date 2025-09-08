import { IsEmail, Matches, MaxLength, MinLength } from "class-validator";
import { ArgsType, Field } from "type-graphql";


@ArgsType()
abstract class BaseUserArgs{

    // @Field(()=>String)
    // id!: string;
    
    @Field(()=> String)
    @IsEmail()
    @MinLength(5, { message: 'Email must be at least 5 characters long' })
    @MaxLength(100, { message: 'Email must be at most 100 characters long' })
    email!: string;

    @Field(()=> String)
    @MaxLength(100, {message:'Password must be at most 100 characters long'})
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.' })
    password!: string;
}


@ArgsType()
export class LoginInputArgs {
    @Field(()=> String)
    @IsEmail()
    @MinLength(5, { message: 'Email must be at least 5 characters long' })
    @MaxLength(100, { message: 'Email must be at most 100 characters long' })
    email!: string;

    @Field(()=> String)
    @MaxLength(100, {message:'Password must be at most 100 characters long'})
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.' })
    password!: string;
}


@ArgsType()
export class Register extends BaseUserArgs{
    @Field(()=> String)
    username!: string;

    // @Field(()=> String, { nullable: true })
    // bio?: string;
}

@ArgsType()
export class UpdateUserArgs extends BaseUserArgs{
    @Field(()=> String)
    @MinLength(3, {message: 'Username must be at least 3 characters long'})
    @MaxLength(100, {message: 'Username must be at most 100 characters long'})
    username!: string;

}

@ArgsType()
export class GetUserArgs{
    @Field(() => String, { nullable: true })
    id?: string;

    @Field(() => String, { nullable: true })
    username?: string;
}