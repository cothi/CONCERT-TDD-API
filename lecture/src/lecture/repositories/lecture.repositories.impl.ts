import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from '../entities/lecture.entity';
import { LectrueRepositories } from './lecture.repositories';
import { Repository } from 'typeorm';

export const LectureRepositoriesSymbol = Symbol('LectureRepositories');

export class LectrueRepositoriesImpl implements LectrueRepositories {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>,
  ) {}

  async createLecture(data: Lecture): Promise<Lecture> {
    const lecture = await this.lectureRepository.create(data);
    return await this.lectureRepository.save(lecture);
  }

  async getLecture(title: string): Promise<Lecture> {
    const lecture = this.lectureRepository.findOne({ where: { title: title } });
    if (!lecture) {
      throw new Error('강의가 존재하지 않습니다');
    }
    return lecture;
  }

  async getAllLectures(): Promise<Lecture[]> {
    return await this.lectureRepository.find();
  }
  async cancelLecture(title: string): Promise<Lecture> {
    const lecture = await this.lectureRepository.findOne({
      where: { title: title },
    });
    if (!lecture) {
      throw new Error('강의가 존재하지 않습니다');
    }
    return await this.lectureRepository.remove(lecture);
  }
}
