import { CreateLectureDto, LectureOutputDto } from "../dto/create-lecture.dto";

export interface LectureService {
  createLecture(data: CreateLectureDto): Promise<LectureOutputDto>;
  getLecture(data: string): Promise<LectureOutputDto>;
  getAllLectures(): Promise<LectureOutputDto>;
}