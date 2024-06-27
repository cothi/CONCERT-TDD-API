import { PickType } from '@nestjs/mapped-types';
import { ApplyLectureDto } from '../../../application/dto/apply-lecture.dto';

export class ApplyLectureRequestDto extends PickType(ApplyLectureDto, [
  'title',
  'name',
  'email',
]) {}
