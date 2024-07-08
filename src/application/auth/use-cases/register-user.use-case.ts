import { Inject, Injectable } from '@nestjs/common';
import { IUseCase } from '../interfaces/use-case.interface';
import { RegisterUserModel } from 'src/domain/auth/model/register-user.model';
import { AuthResponseDto } from 'src/presentation/dto/auth/response/auth.response.dto';
import { IAuthService } from '../interfaces/auth-service.interface';
import { AUTH_SERVICE } from '../symbol/auth-service.symbol';
import { JwtTokenService } from 'src/common/modules/jwt/jwt.service';

@Injectable()
export class RegisterUserUseCase implements IUseCase<RegisterUserModel, AuthResponseDto> {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}
  async execute(input: RegisterUserModel): Promise<AuthResponseDto> {
    const userModel = await this.authService.registerUser(input);

    const accessToken = await this.jwtTokenService.generateAccessToekn({
      userId: userModel.id,
      email: userModel.email,
      type: 'access',
    });

    const refreshToken = await this.jwtTokenService.generateRefreshToken({
      userId: userModel.id,
      email: userModel.email,
      type: 'refresh',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
