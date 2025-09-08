import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Tags extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => String)
  id!: string;

  @Field(() => String)
  @Column({ type: "varchar" })
  name!: string;

  @Field(() => String)
  @Column({ type: "varchar" })
  description!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  @Field(() => String)
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  @Field(() => String)
  updatedAt!: Date;
}
