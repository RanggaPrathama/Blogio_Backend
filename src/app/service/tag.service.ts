import {Inject, Service } from "typedi";
import { Tag } from "../../database/entities/Tags.js";
import { TagRepository } from ;
import {TagInputArgs} from "../../types/params/tags.params.js";

@Service()
export class TagService{
    @Inject(()=>TagRepository)
    private tagRepository!: TagRepository

    

    async getAll(): Promise<Tag[]>{
        return await this.tagRepository.getAll();
}

    async create(tag: TagInputArgs): Promise<Tag>{

        if(!tag || tag.name.trim() === "" || tag.name.length < 3){
            throw new Error("Invalid tag name");
        }
        
        return await this.tagRepository.create(tag);
    }

    async getById(id: string): Promise<Tag | undefined>{
        try{
            return await this.tagRepository.getById(id);
        }catch(error){
            console.error("Error fetching tag by ID:", error);
            throw new Error("Failed to fetch tag");
        }
    }

    async update(id: string, input: TagInputArgs): Promise<Tag | undefined>{
        try{
            return await this.tagRepository.update(id, input);
        }catch(error){
            console.error("Error updating tag:", error);
            throw new Error("Failed to update tag");
        }
    }

    async delete(id: string): Promise<void>{
        try{
            await this.tagRepository.delete(id);
        }catch(error){
            console.error("Error deleting tag:", error);
            throw new Error("Failed to delete tag");
        }
    }
}