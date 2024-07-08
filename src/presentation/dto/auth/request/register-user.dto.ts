import { IsEmail } from 'class-validator';
import { RegisterUserModel } from 'src/domain/auth/model/register-user.model';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  toRegisterUserModel() {
    return RegisterUserModel.create(this.email);
  }
}
