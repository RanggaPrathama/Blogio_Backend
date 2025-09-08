import { User } from '../entities/User';
import type { IUserRepository } from '../repositories/UserRepository';
export interface LoginResult {
    user: User;
    token: string;
}
export declare class LoginService {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute(username: string, password: string): Promise<LoginResult>;
    private generateToken;
}
//# sourceMappingURL=LoginServiceNew.d.ts.map