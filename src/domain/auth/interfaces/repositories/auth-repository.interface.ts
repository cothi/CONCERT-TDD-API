import { UserModel } from '../../model/user.model';
import { RegisterUserModel } from '../../model/register-user.model';
import { FindUserByIdModel } from '../../model/find-use-by-id.model';
import { FindUserByEmailModel } from '../../model/find-user-by-email.model';

export interface IAuthRepository {
  registerUser(model: RegisterUserModel): Promise<UserModel>;
  findUserByEmail(model: FindUserByEmailModel): Promise<UserModel | null>;
  findUserById(model: FindUserByIdModel): Promise<UserModel | null>;
}
