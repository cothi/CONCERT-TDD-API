/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserModel } from 'src/domain/auth/model/login-user.model';
import { RegisterUserModel } from 'src/domain/auth/model/register-user.model';
import { AuthRepository } from 'src/infrastructure/database/repositories/auth/auth.repository';
import { UserModel } from '../model/user.model';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}
  async registerUser(registerUserModel: RegisterUserModel): Promise<UserModel> {
    const model = new LoginUserModel(registerUserModel.email);
    const user = await this.authRepository.findUserByEmail(model.toEntity());
    if (user) {
      throw new HttpException(
        '이미 동일한 이메일이 존재합니다.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return await this.authRepository.registerUser(registerUserModel.toEntity());
  }
  async findUserByEmail(loginUserModel: LoginUserModel): Promise<UserModel> {
    const user = await this.authRepository.findUserByEmail( loginUserModel.toEntity(),); if (!user) {
      throw new HttpException(
        '유저가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async findUserById(userId: string): Promise<UserModel> {
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new HttpException(
        '유저가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }
}
