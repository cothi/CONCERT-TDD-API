import { LoginUserModel } from 'src/domain/auth/model/login-user.model';
import { RegisterUserModel } from 'src/domain/auth/model/register-user.model';
import { UserModel } from 'src/domain/auth/model/user.model';

export interface IAuthService {
  registerUser(userModel: RegisterUserModel): Promise<UserModel>;
  findUserByEmail(userModel: LoginUserModel): Promise<UserModel | null>;
}
