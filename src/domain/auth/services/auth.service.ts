/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { LoginUserModel } from 'src/domain/auth/model/login-user.model';
import { RegisterUserModel } from 'src/domain/auth/model/register-user.model';
import { AuthRepository } from 'src/infrastructure/database/repositories/auth/auth.repository';
import { UserModel } from '../model/user.model';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}
  async registerUser(registerUserModel: RegisterUserModel): Promise<UserModel> {
    return await this.authRepository.registerUser(registerUserModel.toEntity());
  }
  async findUserByEmail(loginUserModel: LoginUserModel): Promise<UserModel> {
    return await this.authRepository.findUserByEmail(loginUserModel.toEntity());
  }

  async findUserById(userId: string): Promise<UserModel | null> {
    return await this.authRepository.findUserById(userId);
  }
}
