import { ApplyLectureResponseDto } from 'src/lecture/presentation/dto/response/apply-lecture.response.dto';
import { ApplyLectureDto } from '../dto/apply-lecture.dto';
import { Application } from 'src/lecture/domain/entities/application.entity';
import { GetLectures } from 'src/lecture/presentation/dto/response/get-lectures.response.dto';

export interface LectureService {
  applyLecture(data: ApplyLectureDto): Promise<ApplyLectureResponseDto>;
  getAllLectures(): Promise<GetLectures>;
}
