import { GraphQLError } from "graphql";

export class AuthError extends GraphQLError {

    constructor(message:string) {
        super(message,{
            extensions: {
                code: 'UNAUTHENTICATED',
                http: { status: 401 },
            },
        })
        this.name = 'AuthError';
    }
    
}