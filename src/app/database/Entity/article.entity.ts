import { Field, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity.js";

@ObjectType()
@Entity()
export class Article {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id!: string;

    @Column({type: 'varchar'})
    @Field(() => String)
    title!: string;

    @Column({type: 'text'})
    @Field(() => String)
    content!: string;

    @Column({type: 'uuid'})
    @Field(() => String)
    authorId!: string;

    @ManyToOne(() => User, user => user.id)
    @Field(() => User)
    author!: User;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    @Field(() => Date)
    createdAt!: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    @Field(() => Date)
    updatedAt!: Date;
}