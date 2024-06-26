import { AdminLectureResponseDto } from 'src/admin/presentation/dto/response/admin-lecture.response.dto';
import { LectureDto } from '../dto/create-lecture.dto';

export interface AdminLectureService {
  createLecture(data: LectureDto): Promise<AdminLectureResponseDto>;
  getLecture(title: string): Promise<AdminLectureResponseDto>;
  getAllLectures(): Promise<AdminLectureResponseDto>;
  cancelLecture(title: string): Promise<AdminLectureResponseDto>;
}
