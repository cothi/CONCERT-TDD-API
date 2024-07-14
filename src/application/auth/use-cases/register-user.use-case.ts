import { Injectable } from '@nestjs/common';
import { JwtTokenService } from 'src/common/modules/jwt/jwt.service';
import { RegisterUserModel } from 'src/domain/auth/model/register-user.model';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { AuthResponseDto } from 'src/presentation/dto/auth/response/auth.response.dto';
import { IUseCase } from '../interfaces/use-case.interface';

@Injectable()
export class RegisterUserUseCase
  implements IUseCase<RegisterUserModel, AuthResponseDto>
{
  constructor(
    private readonly authService: AuthService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}
  async execute(input: RegisterUserModel): Promise<AuthResponseDto> {
    const userModel = await this.authService.registerUser(input);

    const accessToken = await this.jwtTokenService.generateAccessToken({
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
