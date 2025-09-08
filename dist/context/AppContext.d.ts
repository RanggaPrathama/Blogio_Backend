import { UserRepository } from '../repositories/UserRepository';
import { UserService } from '../usecases/UserService';
import { LoginService } from '../usecases/LoginServiceNew';
import { TagRepository } from '../repositories/TagRepository';
import { TagService } from '../usecases/TagService';
export interface AppContext {
    userRepository: UserRepository;
    UserService: UserService;
    LoginService: LoginService;
    tagRepository: TagRepository;
    TagService: TagService;
}
export declare const createAppContext: () => AppContext;
//# sourceMappingURL=AppContext.d.ts.map