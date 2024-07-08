import { IsEmail } from 'class-validator';
import { LoginUserModel } from 'src/domain/auth/model/login-user.model';

export class LoginDto {
  @IsEmail()
  email: string;

  toLoginUserModel() {
    return LoginUserModel.create(this.email);
  }
}
