import { Module } from '@nestjs/common';
import { AUTH_SERVICE } from 'src/application/auth/symbol/auth-service.symbol';
import { LOGIN_USER_USE_CASE } from 'src/application/auth/symbol/login-user.use-case.symbol';
import { REFRESH_TOKEN_USE_CASE } from 'src/application/auth/symbol/refresh-token.symbol';
import { REGISTER_USER_USE_CASE } from 'src/application/auth/symbol/register-user.use-case.symbol';
import { LoginUserUseCase } from 'src/application/auth/use-cases/login-user.use-case';
import { RefreshTokenUseCase } from 'src/application/auth/use-cases/refresh-token.use-case';
import { RegisterUserUseCase } from 'src/application/auth/use-cases/register-user.use-case';
import { JwtTokenModule } from 'src/common/modules/jwt/jwt.module';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { AUTH_REPOSITORY } from 'src/domain/auth/symbol/auth-repository.symbol';
import { DatabaseModule } from 'src/infrastructure/database/prisma.module';
import { AuthRepository } from 'src/infrastructure/database/repositories/auth/auth.repository';
import { AuthController } from '../presentation/controller/auth/auth.controller';

@Module({
  imports: [DatabaseModule, JwtTokenModule],
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
