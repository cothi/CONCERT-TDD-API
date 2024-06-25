import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Lecture } from 'src/lecture/entities/lecture.entity';
import { Application } from 'src/special-lecture/entities/application.entity';
import { LectureCount } from 'src/special-lecture/entities/lecture-count.entity';
import { User } from 'src/users/entities/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5431,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [Lecture, User, LectureCount, Application],
  synchronize: true,
};
