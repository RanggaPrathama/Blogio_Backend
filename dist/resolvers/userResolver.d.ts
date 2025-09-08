import { AppContext } from '../context/AppContext';
import { CreateUserInput } from '../dto/UserInput';
import { User } from '../entities/User';
export declare const userResolver: {
    Query: {
        users: (_: any, { limit, offset }: {
            limit: number;
            offset: number;
        }, context: AppContext) => Promise<{
            success: boolean;
            message: string;
            data: User[];
            errors: never[];
        } | {
            success: boolean;
            message: string;
            data: null;
            errors: string[];
        }>;
        user: (_: any, { id }: {
            id: string;
        }, context: AppContext) => Promise<{
            success: boolean;
            message: string;
            data: null;
            errors: string[];
        } | {
            success: boolean;
            message: string;
            data: User;
            errors: never[];
        }>;
        userByUsername: (_: any, { username }: {
            username: string;
        }, context: AppContext) => Promise<{
            success: boolean;
            message: string;
            data: null;
            errors: string[];
        } | {
            success: boolean;
            message: string;
            data: User;
            errors: never[];
        }>;
        userByEmail: (_: any, { email }: {
            email: string;
        }, context: AppContext) => Promise<{
            success: boolean;
            message: string;
            data: null;
            errors: string[];
        } | {
            success: boolean;
            message: string;
            data: User;
            errors: never[];
        }>;
    };
    Mutation: {
        createUser: (_: any, { input }: {
            input: CreateUserInput;
        }, context: AppContext) => Promise<{
            success: boolean;
            message: string;
            data: User;
            errors: never[];
        } | {
            success: boolean;
            message: string;
            data: null;
            errors: string[];
        }>;
    };
};
//# sourceMappingURL=userResolver.d.ts.map