import { User } from '../entities/User';
import type { IUserRepository } from '../repositories/UserRepository';
export declare class LoginService {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute(username: string, password: string): Promise<User | null>;
}
//# sourceMappingURL=LoginService.d.ts.map