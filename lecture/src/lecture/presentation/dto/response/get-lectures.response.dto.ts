import { CommonDto } from 'src/common/dto/common.dto';
import { Lecture } from 'src/lecture/domain/entities/lecture.entity';

export class GetLectures extends CommonDto {
  lectures?: Lecture[];
}
