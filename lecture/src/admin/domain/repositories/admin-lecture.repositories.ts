import { LectureDomain } from 'src/admin/infrastructure/persistence/model/Lecture.domin.model';
import { Lecture } from 'src/lecture/domain/entities/lecture.entity';

export interface AdminLectureRepositories {
  createLecture(data: LectureDomain): Promise<Lecture>;
  getLecture(data: string): Promise<Lecture>;
  getAllLectures(): Promise<Lecture[]>;
  cancelLecture(title: string): Promise<Lecture>;
}
