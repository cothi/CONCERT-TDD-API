import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialLectureModule } from './lecture/lecture.module';
import { AdminLectureModule } from './admin/admin.module';
import { typeOrmConfig } from './database/ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    AdminLectureModule,
    SpecialLectureModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
