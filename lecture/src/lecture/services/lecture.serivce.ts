import { CreateLectureDto, LectureOutputDto } from '../dto/create-lecture.dto';

export interface LectureService {
  createLecture(data: CreateLectureDto): Promise<LectureOutputDto>;
  getLecture(title: string): Promise<LectureOutputDto>;
  getAllLectures(): Promise<LectureOutputDto>;
  cancelLecture(title: string) : Promise<LectureOutputDto>;
}
