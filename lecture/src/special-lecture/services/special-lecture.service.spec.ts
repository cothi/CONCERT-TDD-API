import { Test, TestingModule } from '@nestjs/testing';
import { SpecialLectureService } from './special-lecture.service.impl';

describe('SpecialLectureService', () => {
  let service: SpecialLectureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialLectureService],
    }).compile();

    service = module.get<SpecialLectureService>(SpecialLectureService);
  });

  describe('특강 신청', () => {
    it('특강 신청시 해당 특강의 성공 여부를 반환한다', async () => {
      const specialLecture = await service.applySpecialLecture({
        title: 'test',
        maxApplicants: 30,
      });
      expect(specialLecture.ok).toEqual(true);
    });
  });
});
