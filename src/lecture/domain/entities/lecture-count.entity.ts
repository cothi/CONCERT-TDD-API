import { CommonEntity } from 'src/common/entity/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lecture } from './lecture.entity';

@Entity()
export class LectureCount extends CommonEntity {
  @Column()
  count: number;

  @Column()
  title: string;

  @OneToOne(() => Lecture, (lecture) => lecture.lectureCount)
  lecture: Lecture;
}
