import { User } from '../entities/User';
/**
 * User repository interface
 */
export interface IUserRepository {
    findByUsername(username: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findAll(limit?: number, offset?: number): Promise<User[]>;
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
}
export declare class UserRepository implements IUserRepository {
    private repo;
    constructor();
    /**
    * Find user by username
    * @param username - The username of the user to find
    * @returns The user if found, or null if not
    */
    findByUsername(username: string): Promise<User | null>;
    /**
     * Find user by ID
     * @param id - The ID of the user to find
     * @returns The user if found, or null if not
     */
    findById(id: string): Promise<User | null>;
    /**
     * Find all users
     * @returns An array of users
     */
    findAll(limit?: number, offset?: number): Promise<User[]>;
    /**
     * Create a new user
     * @param user - The user to create
     * @returns The created user
     */
    create(user: User): Promise<User>;
    /**
     * Find user by email
     * @param email - The email of the user to find
     * @returns The user if found, or null if not
     */
    findByEmail(email: string): Promise<User | null>;
}
//# sourceMappingURL=UserRepository.d.ts.map