import { Module } from '@nestjs/common';
import { SpecialLectureController } from './controller/special-lecture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { LectureCount } from './entities/lecture-count.entity';
import { SpecialLectureServiceImpl, SpecialLectureServiceSymbol } from './services/special-lecture.service.impl';

@Module({
  imports: [TypeOrmModule.forFeature([Application, LectureCount])],
  controllers: [SpecialLectureController],
  providers: [{
    provide: SpecialLectureServiceSymbol,
    useClass: SpecialLectureServiceImpl,
  }],
})
export class SpecialLectureModule {}
