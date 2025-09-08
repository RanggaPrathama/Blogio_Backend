export declare const resolvers: {
    Query: {
        tags: (_: any, __: any, context: import("../context/AppContext").AppContext) => Promise<import("../entities/Tags").Tag[]>;
        users: (_: any, { limit, offset }: {
            limit: number;
            offset: number;
        }, context: import("../context/AppContext").AppContext) => Promise<{
            success: boolean;
            message: string;
            data: import("../entities/User").User[];
            errors: never[];
        } | {
            success: boolean;
            message: string;
            data: null;
            errors: string[];
        }>;
        user: (_: any, { id }: {
            id: string;
        }, context: import("../context/AppContext").AppContext) => Promise<{
            success: boolean;
            message: string;
            data: null;
            errors: string[];
        } | {
            success: boolean;
            message: string;
            data: import("../entities/User").User;
            errors: never[];
        }>;
        userByUsername: (_: any, { username }: {
            username: string;
        }, context: import("../context/AppContext").AppContext) => Promise<{
            success: boolean;
            message: string;
            data: null;
            errors: string[];
        } | {
            success: boolean;
            message: string;
            data: import("../entities/User").User;
            errors: never[];
        }>;
        userByEmail: (_: any, { email }: {
            email: string;
        }, context: import("../context/AppContext").AppContext) => Promise<{
            success: boolean;
            message: string;
            data: null;
            errors: string[];
        } | {
            success: boolean;
            message: string;
            data: import("../entities/User").User;
            errors: never[];
        }>;
    };
    Mutation: {
        createUser: (_: any, { input }: {
            input: import("../dto/UserInput").CreateUserInput;
        }, context: import("../context/AppContext").AppContext) => Promise<{
            success: boolean;
            message: string;
            data: import("../entities/User").User;
            errors: never[];
        } | {
            success: boolean;
            message: string;
            data: null;
            errors: string[];
        }>;
        login: (_: any, { username, password }: {
            username: string;
            password: string;
        }, context: import("../context/AppContext").AppContext) => Promise<{
            user: import("../entities/User").User;
            token: string;
        }>;
    };
};
//# sourceMappingURL=index.d.ts.map