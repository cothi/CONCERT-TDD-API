import { LectureDto } from "src/admin/application/dto/create-lecture.dto";

export class LectureDomain {
  constructor(
    public title: string,
    public maxApplicants: number
  ) { }

  static toDomain(data: LectureDto) {
    return {
      title: data.title,
      maxApplicants: data.maxApplicants
    }

  }

}