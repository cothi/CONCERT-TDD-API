import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AdminLectureServiceImpl,
  AdminLectureServiceSymbol,
} from './application/services/admin.service.impl';
import {
  AdminLectureRepositoriesImpl,
  AdminLectureRepositoriesSymbol,
} from './infrastructure/persistence/repositories/admin-lecture.repositories.impl';
import { LectureCount } from 'src/lecture/domain/entities/lecture-count.entity';
import { AdminLectureController } from './presentation/controller/admin-lecture.controller';
import { Lecture } from 'src/lecture/domain/entities/lecture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture, LectureCount])],
  controllers: [AdminLectureController],
  providers: [
    {
      provide: AdminLectureServiceSymbol,
      useClass: AdminLectureServiceImpl,
    },
    {
      provide: AdminLectureRepositoriesSymbol,
      useClass: AdminLectureRepositoriesImpl,
    },
  ],
})
export class AdminLectureModule {}
