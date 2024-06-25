import { InjectRepository } from '@nestjs/typeorm';
import { CreateLectureDto } from '../dto/create-lecture.dto';
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
    const lecture = this.lectureRepository.create(data);
    return await this.lectureRepository.save(lecture);
    
  }

  async getLecture(data: string): Promise<Lecture> {
    return this.lectureRepository.findOne({ where: { title: data } });
  }

  async getAllLectures(): Promise<Lecture[]> {
    return this.lectureRepository.find();
  }
  async cancelLecture(data: string): Promise<Lecture> {
    const lecture = await this.lectureRepository.findOne({ where: { title: data } });
    return await this.lectureRepository.remove(lecture);
  }
}
