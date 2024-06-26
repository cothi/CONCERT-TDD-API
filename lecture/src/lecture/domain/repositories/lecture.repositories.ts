import { ApplicationDomain } from 'src/lecture/infrastructure/persistence/model/application.domain';
import { Application } from '../entities/application.entity';

export interface LectureRepository {
  applyLecture(data: ApplicationDomain): Promise<Application>;
}
