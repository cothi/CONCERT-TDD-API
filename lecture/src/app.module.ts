import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/database/ormconfig';
import { LectureModule } from './lecture/lecture.module';
import { SpecialLectureModule } from './special-lecture/special-lecture.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), UsersModule, LectureModule, SpecialLectureModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
