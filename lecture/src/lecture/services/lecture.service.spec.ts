import { Test, TestingModule } from '@nestjs/testing';
import { LectureService } from './lecture.serivce';
import { LectrueRepositories } from '../repositories/lecture.repositories';
import {
  LectureRepositoriesSymbol,
  LectrueRepositoriesImpl,
} from '../repositories/lecture.repositories.impl';
import {
  LectureServiceSymbol,
  LectureServiceImpl,
} from './lecture.service.impl';
import { Lecture } from '../entities/lecture.entity';
import { CreateLectureDto } from '../dto/create-lecture.dto';
import { title } from 'process';
import { create } from 'domain';

const mockLectureRepository = {
  createLecture: jest.fn(),
  getLecture: jest.fn(),
  getAllLectures: jest.fn(),
  cancelLecture: jest.fn(),
};
const lecture: Lecture = {
  id: 'test',
  title: 'test',
  maxApplicants: 30,
  updatedAt: new Date(),
  createdAt: new Date(),
  applications: [],
  lectureCount: undefined,
};
describe('LectureService', () => {
  let service: LectureService;
  let lectureRepository: jest.Mocked<LectrueRepositories>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LectureServiceSymbol,
          useClass: LectureServiceImpl,
        },
        {
          provide: LectureRepositoriesSymbol,
          useValue: mockLectureRepository,
        },
      ],
    }).compile();

    service = module.get<LectureService>(LectureServiceSymbol);
    lectureRepository = module.get(LectureRepositoriesSymbol);
  });

  describe('강의 생성', () => {
    it('강의를 생성하면 해당 강의를 반환한다', async () => {
      lectureRepository.createLecture.mockResolvedValue(lecture);

      const res = await service.createLecture(lecture);

      expect(res.ok).toEqual(true);
    });
  });

  describe('강의 조회', () => {
    it('강의를 조회하면 해당 강의를 반환한다.', async () => {
      lectureRepository.getLecture.mockResolvedValue(lecture);
      const res = await service.getLecture('test');

      expect(res.lectures).toMatchObject(lecture);
      expect(res.ok).toEqual(true);
    });
  });

  describe('모든 강의 조회', () => {
    it('모든 강의를 조회하면 모든 강의를 반환한다.', async () => {
      const lectures: Lecture[] = [lecture, lecture, lecture];

      lectureRepository.getAllLectures.mockResolvedValue(lectures);
      const res = await service.getAllLectures();
      expect(res.lectures).toMatchObject(lectures);
      expect(res.ok).toEqual(true);
    });
  });

  describe('강의 취소', () => {
    it('강의 취소시 해당 강의를 취소한다.', async () => {
      lectureRepository.cancelLecture.mockResolvedValue(lecture);
      const res = await service.cancelLecture('test');
      expect(res.ok).toEqual(true);
      expect(res.lectures).toMatchObject(lecture);
    });
  });
});
