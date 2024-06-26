import { ApplyLectureResponseDto } from 'src/lecture/presentation/dto/response/apply-lecture.output.dto';
import { ApplyLectureDto } from '../dto/apply-lecture.dto';
import { Application } from 'src/lecture/domain/entities/application.entity';

export interface LectureService {
  applySpecialLecture(data: ApplyLectureDto): Promise<ApplyLectureResponseDto>;
}
