import { Column, Entity, PrimaryColumn } from "typeorm"

Entity()
export class Lecture {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  MaxxApplicants: number;
}
