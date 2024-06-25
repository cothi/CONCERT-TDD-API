import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

Entity()
export class Lecture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  MaxApplicants: number;
}
