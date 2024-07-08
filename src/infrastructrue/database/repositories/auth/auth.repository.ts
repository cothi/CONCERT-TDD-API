import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
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
}
