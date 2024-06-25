import { CommonDto } from '@src/common/dto/common.dto';
import { Lecture } from '../entities/lecture.entity';

export class CreateLectureDto {}

export class LectureOutputDto extends CommonDto {
  lectures?: Lecture[] | Lecture;
}
