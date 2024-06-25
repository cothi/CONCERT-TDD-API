import { CommonEntity } from 'src/common/entity/common.entity';
import { Lecture } from 'src/lecture/entities/lecture.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class LectureCount extends CommonEntity {
  @Column()
  count: number;

  @OneToOne(() => Lecture, (lecture) => lecture.lectureCount)
  @JoinColumn({ name: 'lectureId' })
  lecture: Lecture;
}
