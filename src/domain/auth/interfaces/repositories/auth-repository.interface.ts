import { RegisterUserEntity } from 'src/domain/auth/entity/register-user.entity';
import { UserModel } from '../../model/user.model';
import { LoginUserEntity } from '../../entity/login-user.entity';

export interface IAuthRepository {
  registerUser(user: RegisterUserEntity): Promise<UserModel>;
  findUserByEmail(user: LoginUserEntity): Promise<UserModel | null>;
  findUserById(userId: string): Promise<UserModel | null>;
}
