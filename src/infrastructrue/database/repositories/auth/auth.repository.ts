import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { LoginUserEntity } from 'src/domain/auth/entity/login-user.entity';
import { RegisterUserEntity } from 'src/domain/auth/entity/register-user.entity';
import { IAuthRepository } from 'src/domain/auth/interfaces/repositories/auth-repository.interface';
import { UserModel } from 'src/domain/auth/model/user.model';
import { PrismaService } from 'src/infrastructrue/database/prisma.service';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async registerUser(user: RegisterUserEntity): Promise<UserModel> {
    const userPrisma: User = await this.prismaService.user.create({
      data: {
        email: user.email,
      },
    });

    return UserModel.create(userPrisma.email, userPrisma.id);
  }

  async findUserByEmail(user: LoginUserEntity): Promise<UserModel | null> {
    const userPrisma: User | null = await this.prismaService.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!userPrisma) {
      return null;
    }
    return UserModel.create(userPrisma.email, userPrisma.id);
  }

  async findUserById(userId: string): Promise<UserModel | null> {
    const userPrisma: User | null = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userPrisma) {
      return null;
    }

    return UserModel.create(userPrisma.email, userPrisma.id);
  }
}
