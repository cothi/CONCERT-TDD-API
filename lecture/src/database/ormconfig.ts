import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Application } from 'src/lecture/domain/entities/application.entity';
import { LectureCount } from 'src/lecture/domain/entities/lecture-count.entity';
import { Lecture } from 'src/lecture/domain/entities/lecture.entity';
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
