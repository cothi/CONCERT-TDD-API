import { CommonDto } from 'src/common/dto/common.dto';

export class GetLectureCountResponseDto extends CommonDto {
  count?: number;
  title?: string;
}
