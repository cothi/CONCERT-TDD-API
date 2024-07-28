import { Module } from '@nestjs/common';
import { LoginUserUseCase } from 'src/application/auth/use-cases/login-user.use-case';
import { RefreshTokenUseCase } from 'src/application/auth/use-cases/refresh-token.use-case';
import { RegisterUserUseCase } from 'src/application/auth/use-cases/register-user.use-case';
import { JwtTokenModule } from 'src/common/modules/jwt/jwt.module';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { AuthRepository } from 'src/infrastructure/auth/repositories/auth.repository';
import { AuthController } from '../presentation/controller/auth/auth.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { PointsModule } from './points.module';

@Module({
  imports: [DatabaseModule, JwtTokenModule, PointsModule],
  controllers: [AuthController],
  providers: [
    RefreshTokenUseCase,
    RegisterUserUseCase,
    LoginUserUseCase,
    AuthService,
    AuthRepository,
  ],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
