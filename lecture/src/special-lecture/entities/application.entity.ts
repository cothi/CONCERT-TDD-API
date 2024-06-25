import { CommonEntity } from 'src/common/entity/common.entity';
import { Lecture } from 'src/lecture/entities/lecture.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Application extends CommonEntity {
  @Column()
  applicationDate: Date;

  @Column()
  status: string;

  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Lecture, (lecture) => lecture.applications)
  @JoinColumn({ name: 'lectureId' })
  lecture: Lecture;
}
