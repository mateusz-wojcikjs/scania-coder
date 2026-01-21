import { UpdatePayload } from "@scania-coder/types";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: "LAYOUTS"
})

export class Layout {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column("jsonb")
  updates: UpdatePayload[];

  @Column()
  authorId: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;
  
  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}
