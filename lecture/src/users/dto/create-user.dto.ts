import { IsDate, IsEmail, IsString, IsUUID } from 'class-validator';
import { CommonDto } from 'src/common/dto/common.dto';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}

export class UserOutputDto extends CommonDto {
  user?: User;
  users?: User[];
}
