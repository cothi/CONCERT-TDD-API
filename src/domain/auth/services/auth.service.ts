/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserModel } from 'src/domain/auth/model/register-user.model';
import { AuthRepository } from 'src/infrastructure/auth/repositories/auth.repository';
import { FindUserByEmailModel } from '../model/find-user-by-email.model';
import { UserModel } from '../model/user.model';
import { FindUserByIdModel } from '../model/find-use-by-id.model';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}
  async registerUser(model: RegisterUserModel): Promise<UserModel> {
    const findModel = FindUserByEmailModel.create(model.email);
    const user = await this.authRepository.findUserByEmail(findModel);
    if (user) {
      throw new HttpException(
        '이미 동일한 이메일이 존재합니다.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return await this.authRepository.registerUser(model)
  }
  async findUserByEmail(model: FindUserByEmailModel): Promise<UserModel> {
    const user = await this.authRepository.findUserByEmail(model);
    if (!user) {
      throw new HttpException(
        '유저가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async findUserById(model: FindUserByIdModel): Promise<UserModel> {
    const user = await this.authRepository.findUserById(model);
    if (!user) {
      throw new HttpException(
        '유저가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }
}
