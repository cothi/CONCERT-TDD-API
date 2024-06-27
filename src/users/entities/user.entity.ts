import { CommonEntity } from 'src/common/entity/common.entity';
import { Application } from 'src/lecture/domain/entities/application.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Application, (application) => application.user, {
    onDelete: 'CASCADE',
  })
  applications: Application[];
}
