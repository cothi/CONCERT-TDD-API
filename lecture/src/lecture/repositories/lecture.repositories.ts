import { CreateLectureDto } from "../dto/create-lecture.dto";
import { Lecture } from "../entities/lecture.entity";

export interface LectrueRepositories {
  createLecture(data: CreateLectureDto): Promise<Lecture>;
  getLecture(data: string): Promise<Lecture>;
  getAllLectures(): Promise<Lecture[]>;
}