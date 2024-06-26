import { Test, TestingModule } from '@nestjs/testing';
import { LectureService } from './lecture.service';
import {
  LectureServiceImpl,
  LectureServiceSymbol,
} from './lecture.service.impl';

describe('SpecialLectureService', () => {
  let service: LectureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LectureServiceSymbol,
          useClass: LectureServiceImpl,
        },
      ],
    }).compile();

    service = module.get<LectureService>(LectureServiceSymbol);
  });

  describe('특강 신청', () => {
    it('특강 신청시 해당 특강의 성공 여부를 반환한다', async () => {
      const specialLecture = await service.applySpecialLecture({
        title: 'test',
        name: 'test',
        email: 'test@gmail.ai',
      });
      expect(specialLecture.ok).toEqual(true);
    });
  });
});
