import { RegisterUserEntity } from 'src/domain/auth/entity/register-user.entity';
import { UserModel } from '../../model/user.model';

export interface IAuthRepository {
  registerUser(user: RegisterUserEntity): Promise<UserModel>;
}
