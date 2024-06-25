import { Test, TestingModule } from '@nestjs/testing';
import { SpecialLectureController } from './special-lecture.controller';
import { SpecialLectureService } from '../services/special-lecture.service.impl';

describe('SpecialLectureController', () => {
  let controller: SpecialLectureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialLectureController],
      providers: [SpecialLectureService],
    }).compile();

    controller = module.get<SpecialLectureController>(SpecialLectureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
