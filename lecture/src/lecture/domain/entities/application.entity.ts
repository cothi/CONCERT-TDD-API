import { CommonEntity } from 'src/common/entity/common.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lecture } from './lecture.entity';

@Entity()
export class Application extends CommonEntity {
  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Lecture, (lecture) => lecture.applications)
  @JoinColumn({ name: 'lectureId' })
  lecture: Lecture;
}
