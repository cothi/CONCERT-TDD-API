import { UserModel } from './../../../domain/auth/model/user.model';
/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable } from '@nestjs/common';
import { LoginUserModel } from 'src/domain/auth/model/login-user.model';
import { RegisterUserModel } from 'src/domain/auth/model/register-user.model';
import { AUTH_REPOSITORY } from 'src/domain/auth/symbol/auth-repository.symbol';
import { IAuthRepository } from '../../../domain/auth/interfaces/repositories/auth-repository.interface';
import { IAuthService } from '../interfaces/auth-service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
  ) {}
  async registerUser(registerUserModel: RegisterUserModel): Promise<UserModel> {
    return await this.authRepository.registerUser(registerUserModel.toEntity());
  }
  async findUserByEmail(loginUserModel: LoginUserModel): Promise<UserModel> {
    return await this.authRepository.findUserByEmail(loginUserModel.toEntity());
  }
}
