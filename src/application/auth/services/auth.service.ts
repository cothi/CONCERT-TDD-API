/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable } from '@nestjs/common';
import { RegisterUserModel } from 'src/domain/auth/model/register-user.model';
import { UserModel } from 'src/domain/auth/model/user.model';
import { IAuthService } from '../interfaces/auth-service.interface';
import { AUTH_REPOSITORY } from 'src/domain/auth/symbol/auth-repository.symbol';
import { IAuthRepository } from '../../../domain/auth/interfaces/repositories/auth-repository.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
  ) {}
  async registerUser(userModel: RegisterUserModel): Promise<UserModel> {
    return await this.authRepository.registerUser(userModel.toEntity());
  }
}
