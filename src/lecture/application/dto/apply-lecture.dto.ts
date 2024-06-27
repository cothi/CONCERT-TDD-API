import { IsString } from 'class-validator';
import { CommonDto } from 'src/common/dto/common.dto';
import { Application } from 'src/lecture/domain/entities/application.entity';

export class ApplyLectureDto {
  @IsString()
  title: string;

  @IsString()
  name: string;

  @IsString()
  email: string;
}

export class ApplyLectureOutputDto extends CommonDto {
  applications?: Application[] | Application;
}
