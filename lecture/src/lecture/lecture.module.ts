import { Module } from '@nestjs/common';
import { Lecture } from 'src/lecture/entities/lecture.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureController } from './controller/lecture.controller';
import {
  LectureServiceImpl,
  LectureServiceSymbol,
} from './services/lecture.service.impl';
import { LectureRepositoriesSymbol, LectrueRepositoriesImpl } from './repositories/lecture.repositories.impl';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture])],
  controllers: [LectureController],
  providers: [
    {
      provide: LectureServiceSymbol,
      useClass: LectureServiceImpl,
    },
    {
      provide: LectureRepositoriesSymbol,
      useClass: LectrueRepositoriesImpl
    },
  ],
})
export class LectureModule {}
