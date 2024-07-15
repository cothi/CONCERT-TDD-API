import { JwtTokenService } from 'src/common/modules/jwt/jwt.service';
import { RefreshTokenModel } from 'src/domain/auth/model/refresh-token.model';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { RefreshTokenResponseDto } from 'src/presentation/dto/auth/response/refresh-token.response.dto';
import { IUseCase } from '../../../common/interfaces/use-case.interface';

export class RefreshTokenUseCase
  implements IUseCase<RefreshTokenModel, RefreshTokenResponseDto>
{
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly authService: AuthService,
  ) {}
  async execute(input: RefreshTokenModel): Promise<RefreshTokenResponseDto> {
    try {
      const tokenResult = this.jwtTokenService.verifyToken(input.accessToken);

      const user = await this.authService.findUserById(
        tokenResult.payload.userId,
      );

      const accessToken = this.jwtTokenService.generateAccessToken({
        userId: user.id,
        email: user.email,
        type: 'access',
      });
      return { accessToken };
    } catch (error) {
      throw error;
    }
  }
}
