import { JwtTokenService } from 'src/common/modules/jwt/jwt.service';
import { LoginUserModel } from 'src/domain/auth/model/login-user.model';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { AuthResponseDto } from 'src/presentation/dto/auth/response/auth.response.dto';
import { IUseCase } from '../interfaces/use-case.interface';

export class LoginUserUseCase
  implements IUseCase<LoginUserModel, AuthResponseDto>
{
  constructor(
    private readonly authService: AuthService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(input: LoginUserModel): Promise<AuthResponseDto> {
    const userModel = await this.authService.findUserByEmail(input);
    if (!userModel) {
      throw new Error('User not found');
    }

    const accessToken = this.jwtTokenService.generateAccessToken({
      userId: userModel.id,
      email: userModel.email,
      type: 'access',
    });
    const refreshToken = this.jwtTokenService.generateRefreshToken({
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
