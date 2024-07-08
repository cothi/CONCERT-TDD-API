import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AUTH_SERVICE } from 'src/application/auth/symbol/auth-service.symbol';
import { JwtTokenModule } from 'src/common/modules/jwt/jwt.module';
import { AUTH_REPOSITORY } from 'src/domain/auth/symbol/auth-repository.symbol';
import { DatabaseModule } from 'src/infrastructrue/database/prisma.module';
import { AuthRepository } from 'src/infrastructrue/database/repositories/auth/auth.repository';
import { AuthController } from '../presentation/controller/auth/auth.controller';
import { AuthService } from './../application/auth/services/auth.service';
import { REGISTER_USER_USE_CASE } from 'src/application/auth/symbol/register-user.use-case.symbol';
import { RegisterUserUseCase } from 'src/application/auth/use-cases/register-user.use-case';

@Module({
  imports: [DatabaseModule, JwtTokenModule, CqrsModule],
  providers: [
    {
      provide: REGISTER_USER_USE_CASE,
      useClass: RegisterUserUseCase,
    },
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthRepository,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
