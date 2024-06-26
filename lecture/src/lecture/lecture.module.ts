import { Application } from './domain/entities/application.entity';
import { LectureCount } from './domain/entities/lecture-count.entity';
import { Module } from '@nestjs/common';
import { SpecialLectureController } from './presentation/controllers/lecture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  LectureServiceImpl,
  LectureServiceSymbol,
} from './application/services/lecture.service.impl';
import {
  LectureRepositoryImpl,
  LectureRepositorySymbol,
} from './infrastructure/persistence/repositories/lecture.repositories.impl';
import { Lecture } from './domain/entities/lecture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Application, Lecture, LectureCount])],
  controllers: [SpecialLectureController],
  providers: [
    {
      provide: LectureServiceSymbol,
      useClass: LectureServiceImpl,
    },
    {
      provide: LectureRepositorySymbol,
      useClass: LectureRepositoryImpl,
    },
  ],
})
export class SpecialLectureModule {}
