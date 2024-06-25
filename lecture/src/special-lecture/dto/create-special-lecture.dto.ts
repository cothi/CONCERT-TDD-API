import { CommonDto } from 'src/common/dto/common.dto';
import { Application } from '../entities/application.entity';

export class ApplySpecialLectureDto {
  title: string;

  name: string;

  email: string;
}

export class ApplySpecialLectureOutputDto extends CommonDto {
  applications?: Application[] | Application;
}
