import { CommonEntity } from 'src/common/entity/common.entity';
import { Application } from 'src/lecture/domain/entities/application.entity';
import { LectureCount } from 'src/lecture/domain/entities/lecture-count.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Lecture extends CommonEntity {
  @Column()
  title: string;

  @Column({ unique: true })
  maxApplicants: number;

  @OneToMany(() => Application, (application) => application.lecture, {
    onDelete: 'CASCADE',
  })
  applications: Application[];

  @OneToOne(() => LectureCount, (lectureCount) => lectureCount.lecture)
  @JoinColumn()
  lectureCount: LectureCount;
}
