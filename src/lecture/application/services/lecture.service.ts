import { ApplyLectureResponseDto } from 'src/lecture/presentation/dto/response/apply-lecture.response.dto';
import { ApplyLectureDto } from '../dto/apply-lecture.dto';
import { GetLectures } from 'src/lecture/presentation/dto/response/get-lectures.response.dto';
import { GetLectureCountResponseDto } from 'src/lecture/presentation/dto/response/get-lecture-count.response.dto';
import { GetApplicationsByNameResponseDto } from 'src/lecture/presentation/dto/response/get-applications-by-name.response.dto';

export interface LectureService {
  applyLecture(data: ApplyLectureDto): Promise<ApplyLectureResponseDto>;
  getAllLectures(): Promise<GetLectures>;
  getLectureCount(title: string): Promise<GetLectureCountResponseDto>;
  getApplicationsByName(
    name: string,
  ): Promise<GetApplicationsByNameResponseDto>;
}
