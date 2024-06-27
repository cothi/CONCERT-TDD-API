import { CommonDto } from 'src/common/dto/common.dto';
import { User } from 'src/users/domain/entities/user.entity';

export class UserResponseDto extends CommonDto {
  users?: User[] | User;
}
