import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { IAuthRepository } from 'src/domain/auth/interfaces/repositories/auth-repository.interface';
import { FindUserByIdModel } from 'src/domain/auth/model/find-use-by-id.model';
import { FindUserByEmailModel } from 'src/domain/auth/model/find-user-by-email.model';
import { RegisterUserModel } from 'src/domain/auth/model/register-user.model';
import { UserModel } from 'src/domain/auth/model/user.model';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { AuthMapper } from '../mapper/auth.mapper';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async registerUser(model: RegisterUserModel): Promise<UserModel> {
    const entity = AuthMapper.mapToRegisterUserEntity(model);
    const userPrisma: User = await this.prismaService.user.create({
      data: {
        email: entity.email
      },
    });
    return AuthMapper.mapToUserModel(userPrisma);
  }

  async findUserByEmail(model: FindUserByEmailModel): Promise<UserModel | null> {
    const entity = AuthMapper.mapToFindUserByEmailEntity(model);
    const userPrisma: User | null = await this.prismaService.user.findUnique({
      where: {
        email: entity.email
      },
    });
    return AuthMapper.mapToUserModel(userPrisma);
  }

  async findUserById(model: FindUserByIdModel): Promise<UserModel | null> {
    const entity = AuthMapper.mapToFindUserByIdEntity(model);
    const userPrisma: User | null = await this.prismaService.user.findUnique({
      where: {
        id: entity.id,
      },
    });
    return AuthMapper.mapToUserModel(userPrisma);
  }
}
