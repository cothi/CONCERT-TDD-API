import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/database/ormconfig';
import { SpecialLectureModule } from './lecture/lecture.module';
import { AdminLectureModule } from './admin/admin.module';

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
