import { CommonDto } from 'src/common/dto/common.dto';
import { OmitType, PickType } from '@nestjs/mapped-types';
import { Lecture } from 'src/lecture/domain/entities/lecture.entity';

export class LectureDto extends PickType(Lecture, [
  'title',
  'maxApplicants',
])
{ }
  
