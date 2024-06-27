import { ApplyLectureResponseDto } from 'src/lecture/presentation/dto/response/apply-lecture.response.dto';
import { ApplyLectureDto } from '../dto/apply-lecture.dto';
import { GetLectures } from 'src/lecture/presentation/dto/response/get-lectures.response.dto';
import { getLectureCountResponseDto } from 'src/lecture/presentation/dto/response/get-lecture-count.response.dto';

export interface LectureService {
  applyLecture(data: ApplyLectureDto): Promise<ApplyLectureResponseDto>;
  getAllLectures(): Promise<GetLectures>;
  getLectureCount(): Promise<getLectureCountResponseDto>;
}
