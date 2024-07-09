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
import { LOGIN_USER_USE_CASE } from 'src/application/auth/symbol/login-user.use-case.symbol';
import { LoginUserUseCase } from 'src/application/auth/use-cases/login-user.use-case';
import { REFRESH_TOKEN_USE_CASE } from 'src/application/auth/symbol/refresh-token.symbol';
import { RefreshTokenUseCase } from 'src/application/auth/use-cases/refresh-token.use-case';

@Module({
  imports: [DatabaseModule, JwtTokenModule, CqrsModule],
  providers: [
    {
      provide: REFRESH_TOKEN_USE_CASE,
      useClass: RefreshTokenUseCase,
    },
    {
      provide: REGISTER_USER_USE_CASE,
      useClass: RegisterUserUseCase,
    },
    {
      provide: LOGIN_USER_USE_CASE,
      useClass: LoginUserUseCase,
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
