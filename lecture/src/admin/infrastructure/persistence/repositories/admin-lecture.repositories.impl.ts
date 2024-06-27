import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LectureCount } from 'src/lecture/domain/entities/lecture-count.entity';
import { Injectable } from '@nestjs/common';
import { Lecture } from 'src/lecture/domain/entities/lecture.entity';
import { AdminLectureRepositories } from 'src/admin/domain/repositories/admin-lecture.repositories';

export const AdminLectureRepositoriesSymbol = Symbol(
  'AdminLectureRepositories',
);

@Injectable()
export class AdminLectureRepositoriesImpl implements AdminLectureRepositories {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>,

    @InjectRepository(LectureCount)
    private readonly lectureCountRepository: Repository<LectureCount>,
  ) {}

  async createLecture(data: Lecture): Promise<Lecture> {
    const lectureCount = this.lectureCountRepository.create({
      title: data.title,
      count: 0,
    });
    await this.lectureCountRepository.save(lectureCount);
    const lecture = await this.lectureRepository.save({
      lectureCount,
      ...data,
    });
    return lecture;
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
    await this.lectureCountRepository.delete({ title: title });
    return await this.lectureRepository.remove(lecture);
  }
}
