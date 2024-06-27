import { ApplicationDomain } from 'src/lecture/infrastructure/persistence/model/application.domain';
import { Application } from '../entities/application.entity';
import { Lecture } from '../entities/lecture.entity';
import { LectureCount } from '../entities/lecture-count.entity';
import { QueryRunner } from 'typeorm';

export interface LectureRepository {
  applyLecture(data: ApplicationDomain): Promise<Application>;
  getAllLectures(): Promise<Lecture[]>;
  getLecture(title: string): Promise<Lecture>;
  getLectureCount(title: string): Promise<LectureCount>;
  getApplicationsByName(name: string): Promise<Application[]>;
}
