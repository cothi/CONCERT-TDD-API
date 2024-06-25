import { Module } from '@nestjs/common';
import { LectureService } from './services/lecture.service.impl';
import { LectureController } from './controller/lecture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from './entities/lecture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture])],
  controllers: [LectureController],
  providers: [LectureService],
})
export class LectureModule {}
