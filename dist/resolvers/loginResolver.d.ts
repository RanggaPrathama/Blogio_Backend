import { AppContext } from '../context/AppContext';
export declare const loginResolver: {
    Mutation: {
        login: (_: any, { username, password }: {
            username: string;
            password: string;
        }, context: AppContext) => Promise<{
            user: import("../entities/User").User;
            token: string;
        }>;
    };
};
//# sourceMappingURL=loginResolver.d.ts.map