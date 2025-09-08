import type { IUserRepository } from "../repositories/UserRepository";
import { User } from "../entities/User";
export interface CreateUserData {
    username: string;
    email: string;
    password: string;
    bio?: string;
    photo?: string;
}
export declare class UserService {
    private userRepository;
    constructor(userRepository: IUserRepository);
    getById(id: string): Promise<User>;
    getByUsername(username: string): Promise<User>;
    getAll(limit: number, offset: number): Promise<User[]>;
    getByEmail(email: string): Promise<User>;
    create(userData: CreateUserData): Promise<User>;
}
//# sourceMappingURL=UserService.d.ts.map