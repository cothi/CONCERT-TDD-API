import {
  ApplySpecialLectureDto,
  ApplySpecialLectureOutputDto,
} from '../dto/create-special-lecture.dto';

export interface SpecialLectureService {
  applySpecialLecture(
    data: ApplySpecialLectureDto,
  ): Promise<ApplySpecialLectureOutputDto>;
}
