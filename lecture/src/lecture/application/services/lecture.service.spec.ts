import { Test, TestingModule } from '@nestjs/testing';
import { LectureService } from './lecture.service';
import {
  LectureServiceImpl,
  LectureServiceSymbol,
} from './lecture.service.impl';
import { LectureRepositorySymbol } from 'src/lecture/infrastructure/persistence/repositories/lecture.repositories.impl';
import { LectureRepository } from 'src/lecture/domain/repositories/lecture.repositories';
import { Application } from 'src/lecture/domain/entities/application.entity';
import { User } from 'src/users/entities/user.entity';
import { Lecture } from 'src/lecture/domain/entities/lecture.entity';
import { LectureCount } from 'src/lecture/domain/entities/lecture-count.entity';

const mockLectureRepository = {
  applyLecture: jest.fn(),
  getAllLectures: jest.fn(),
  getLectureCount: jest.fn(),
  getLecture: jest.fn(),
};

describe('SpecialLectureService', () => {
  let service: LectureService;
  let repository: jest.Mocked<LectureRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LectureServiceSymbol,
          useClass: LectureServiceImpl,
        },
        {
          provide: LectureRepositorySymbol,
          useValue: mockLectureRepository,
        },
      ],
    }).compile();

    service = module.get<LectureService>(LectureServiceSymbol);
    repository = module.get(LectureRepositorySymbol);
  });

  describe('특강 신청', () => {
    it('특강 신청시 해당 특강의 성공 여부를 반환한다', async () => {
      const application: Application = {
        id: '',
        user: new User(),
        lecture: new Lecture(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await repository.applyLecture.mockResolvedValue(application);
      const specialLecture = await service.applyLecture({
        title: 'test',
        name: 'test',
        email: 'test@gmail.ai',
      });

      expect(specialLecture.ok).toEqual(true);
    });
  });

  describe('특강 목록 확인', () => {
    it('특강 목록을 확인하면 해당 특강 목록을 반환한다', async () => {
      const lectures: Lecture[] = [
        {
          id: 'test',
          title: 'test',
          maxApplicants: 30,
          updatedAt: new Date(),
          createdAt: new Date(),
          applications: new Array<Application>(),
          lectureCount: new LectureCount(),
        },
      ];
      await repository.getAllLectures.mockResolvedValue(lectures);
      const specialLectures = await service.getAllLectures();

      expect(specialLectures.ok).toEqual(true);
    });
  });

  describe('특강 성공 여부 확인', () => {
    it('특강에 몇명 남았는지 확인한다.', async () => {
      const title = 'test';
      const lectureCount: LectureCount = {
        id: 'test',
        title: 'test',
        count: 10,
        updatedAt: new Date(),
        createdAt: new Date(),
        lecture: new Lecture(),
      };
      const lecture: Lecture = {
        id: 'test',
        title: 'test',
        maxApplicants: 30,
        updatedAt: new Date(),
        createdAt: new Date(),
        applications: new Array<Application>(),
        lectureCount: lectureCount,
      };

      repository.getLecture.mockResolvedValue(lecture);

      const result = await service.getLectureCount(title);

      expect(result.ok).toEqual(true);
      expect(result.count).toEqual(20);
    });
  });
});
