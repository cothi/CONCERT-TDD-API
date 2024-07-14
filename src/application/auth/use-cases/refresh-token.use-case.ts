import { JwtTokenService } from 'src/common/modules/jwt/jwt.service';
import { RefreshTokenModel } from 'src/domain/auth/model/refresh-token.model';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { RefreshTokenResponseDto } from 'src/presentation/dto/auth/response/refresh-token.response.dto';
import { IUseCase } from '../interfaces/use-case.interface';

export class RefreshTokenUseCase
  implements IUseCase<RefreshTokenModel, RefreshTokenResponseDto>
{
  constructor(
    private readonly jwtTokenSerice: JwtTokenService,
    private readonly authService: AuthService,
  ) {}
  async execute(input: RefreshTokenModel): Promise<RefreshTokenResponseDto> {
    const tokenResult = this.jwtTokenSerice.verifyToken(input.accessToken);
    if (!tokenResult.isValid) {
      throw new Error('Invalid token');
    }

    const user = await this.authService.findUserById(
      tokenResult.payload.userId,
    );
    if (!user) {
      throw new Error('User not found');
    }

    const accessToken = this.jwtTokenSerice.generateAccessToken({
      userId: tokenResult.payload.userId,
      email: tokenResult.payload.email,
      type: 'access',
    });
    return { accessToken };
  }
}
