export interface LectrueRepositories {
  createLecture(data: CreateLectureDto): Promise<LectureOutputDto>;
  getLecture(data: string): Promise<LectureOutputDto>;
  getAllLectures(): Promise<LectureOutputDto>;
}