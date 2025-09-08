import { Tag } from "../entities/Tags";
import { TagRepository } from "../repositories/TagRepository";
export declare class TagService {
    private tagRepository;
    constructor(tagRepo: TagRepository);
    getAll(): Promise<Tag[]>;
    create(tag: Tag): Promise<Tag>;
}
//# sourceMappingURL=TagService.d.ts.map