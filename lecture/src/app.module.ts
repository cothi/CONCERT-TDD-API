import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/database/ormconfig';
import { LectureModule } from './lecture/lecture.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), UsersModule, LectureModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
