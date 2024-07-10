import { JwtTokenService } from 'src/common/modules/jwt/jwt.service';
import { IUseCase } from '../interfaces/use-case.interface';
import { Inject } from '@nestjs/common';
import { AUTH_SERVICE } from '../symbol/auth-service.symbol';
import { IAuthService } from '../interfaces/auth-service.interface';
import { RefreshTokenResponseDto } from 'src/presentation/dto/auth/response/refresh-token.response.dto';
import { RefreshTokenModel } from 'src/domain/auth/model/refresh-token.model';

export class RefreshTokenUseCase
  implements IUseCase<RefreshTokenModel, RefreshTokenResponseDto>
{
  constructor(
    private readonly jwtTokenSerice: JwtTokenService,
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
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
