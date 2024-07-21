import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/interfaces/use-case.interface';
import { JwtTokenService } from 'src/common/modules/jwt/jwt.service';
import { FindUserByEmailModel } from 'src/domain/auth/model/find-user-by-email.model';
import { LoginUserModel } from 'src/domain/auth/model/login-user.model';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { AuthResponseDto } from 'src/presentation/dto/auth/response/auth.response.dto';

@Injectable()
export class LoginUserUseCase
  implements IUseCase<LoginUserModel, AuthResponseDto>
{
  constructor(
    private readonly authService: AuthService,
    private readonly jwtTokenService: JwtTokenService
  ) {}

  async execute(input: LoginUserModel): Promise<AuthResponseDto> {
    try {
      const findModel = FindUserByEmailModel.create(input.email);
      const user = await this.authService.findUserByEmail(findModel);
      const accessToken = this.jwtTokenService.generateAccessToken({
        userId: user.id,
        email: user.email,
        type: 'access',
      });
      const refreshToken = this.jwtTokenService.generateRefreshToken({
        userId: user.id,
        email: user.email,
        type: 'refresh',
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }
}
