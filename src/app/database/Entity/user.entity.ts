import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./article.entity.js";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id!: string;

    @Column({type: 'varchar'})
    @Field(() => String)
    username!: string;

    @Column({type:'varchar', unique: true})
    @Field(()=> String)
    email!: string;

    @Column({type:'varchar'})
    @Field(() => String)
    password!: string;

    @Column({ type: 'varchar', nullable: true })
    @Field(() => String, { nullable: true })
    bio?: string;

    @OneToMany(() => Article, article => article.author)
    @Field(() => [Article])
    articles!: Article[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @Field(() => String)
    createdAt!: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    @Field(() => String)
    updatedAt!: Date;
}