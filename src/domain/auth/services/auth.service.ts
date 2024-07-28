/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/common/enums/error-code.enum';
import { ErrorFactory } from 'src/common/errors/error-factory.error';
import { RegisterUserModel } from 'src/domain/auth/model/register-user.model';
import { AuthRepository } from 'src/infrastructure/auth/repositories/auth.repository';
import { FindUserByIdModel } from '../model/find-use-by-id.model';
import { FindUserByEmailModel } from '../model/find-user-by-email.model';
import { UserModel } from '../model/user.model';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}
  async registerUser(model: RegisterUserModel): Promise<UserModel> {
    const findModel = FindUserByEmailModel.create(model.email);
    const user = await this.authRepository.findUserByEmail(findModel);
    if (user) {
      throw ErrorFactory.createException(ErrorCode.USER_ALREADY_EXISTS);
    }
    return await this.authRepository.registerUser(model);
  }
  async findUserByEmail(model: FindUserByEmailModel): Promise<UserModel> {
    const user = await this.authRepository.findUserByEmail(model);
    if (!user) {
      throw ErrorFactory.createException(ErrorCode.USER_NOT_FOUND);
    }
    return user;
  }

  async findUserById(model: FindUserByIdModel): Promise<UserModel> {
    const user = await this.authRepository.findUserById(model);
    if (!user) {
      throw ErrorFactory.createException(ErrorCode.USER_NOT_FOUND);
    }
    return user;
  }
}
