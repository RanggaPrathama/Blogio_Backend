import { Tag } from "../entities/Tags";
interface ITagRepository {
    getAll(): Promise<Tag[]>;
    create(tag: Tag): Promise<Tag>;
}
export declare class TagRepository implements ITagRepository {
    private repo;
    constructor();
    getAll(): Promise<Tag[]>;
    create(tag: Tag): Promise<Tag>;
}
export {};
//# sourceMappingURL=TagRepository.d.ts.map