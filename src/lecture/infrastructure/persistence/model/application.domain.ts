import { ApplyLectureDto } from 'src/lecture/application/dto/apply-lecture.dto';

export class ApplicationDomain {
  constructor(
    public name: string,
    public email: string,
    public title: string,
  ) {}

  static toDomain(data: ApplyLectureDto): ApplicationDomain {
    return new ApplicationDomain(data.name, data.email, data.title);
  }
}
