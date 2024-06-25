import { Test, TestingModule } from '@nestjs/testing';
import { LectureService } from './lecture.service';

describe('LectureService', () => {
  let service: LectureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LectureService],
    }).compile();

    service = module.get<LectureService>(LectureService);
  });


  describe('강의 생성', () => {
    it ('강의를 생성하면 해당 강의를 반환한다', async () => {
      const lecture = {
        id: 'qwer',
        name: 'test',
        description: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const res = await service.createLecture({
        name: lecture.name,
        description: lecture.description,
      });

      expect(res.ok).toEqual(true);
    }
  })


});
