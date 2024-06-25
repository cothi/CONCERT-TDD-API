import { Test, TestingModule } from '@nestjs/testing';
import { LectureController } from './lecture.controller';
import { LectureService } from '../services/lecture.service.impl';

describe('LectureController', () => {
  let controller: LectureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LectureController],
      providers: [LectureService],
    }).compile();

    controller = module.get<LectureController>(LectureController);
  });
});
