import { CommonDto } from 'src/common/dto/common.dto';
import { Application } from 'src/lecture/domain/entities/application.entity';

export class GetApplicationsByNameResponseDto extends CommonDto {
  applications?: Application[];
}
