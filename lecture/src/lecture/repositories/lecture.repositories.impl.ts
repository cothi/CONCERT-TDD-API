import { InjectRepository } from '@nestjs/typeorm';
import { CreateLectureDto } from '../dto/create-lecture.dto';
import { Lecture } from '../entities/lecture.entity';
import { LectrueRepositories } from './lecture.repositories';
import { Repository } from 'typeorm';

export const LectureLepositoriesSymbol = Symbol('LectureLepositories');

export class LectrueRepositoriesImpl implements LectrueRepositories {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>,
  ) {}

  async createLecture(data: CreateLectureDto): Promise<Lecture> {
    return this.lectureRepository.save(data);
  }

  async getLecture(data: string): Promise<Lecture> {
    return this.lectureRepository.findOne({ where: { title: data } });
  }

  async getAllLectures(): Promise<Lecture[]> {
    return this.lectureRepository.find();
  }
}
