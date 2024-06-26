import { ApplicationDomain } from 'src/lecture/infrastructure/persistence/model/application.domain';
import { Application } from '../entities/application.entity';
import { Lecture } from '../entities/lecture.entity';

export interface LectureRepository {
  applyLecture(data: ApplicationDomain): Promise<Application>;
  //lectureApplication(data: ApplicationDomain): Promise<Application>;
  getAllLectures(): Promise<Lecture[]>;
}
