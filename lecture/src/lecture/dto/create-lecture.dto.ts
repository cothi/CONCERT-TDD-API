import { CommonDto } from 'src/common/dto/common.dto';
import { Lecture } from '../entities/lecture.entity';
import { OmitType } from '@nestjs/mapped-types';

export class CreateLectureDto extends OmitType(Lecture, ['id']) {}

export class LectureOutputDto extends CommonDto {
  lectures?: Lecture[] | Lecture;
}
