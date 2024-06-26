import { Lecture } from 'src/lecture/domain/entities/lecture.entity';
import { PickType } from '@nestjs/mapped-types';

export class LectureRegisterRequestDto extends PickType(Lecture, [
  'title',
  'maxApplicants',
]) {}
