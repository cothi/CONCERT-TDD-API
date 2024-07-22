import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/interfaces/use-case.interface';
import { JwtTokenService } from 'src/common/modules/jwt/jwt.service';
import { FindUserByIdModel } from 'src/domain/auth/model/find-use-by-id.model';
import { RefreshTokenModel } from 'src/domain/auth/model/refresh-token.model';
import { AuthService } from 'src/domain/auth/services/auth.service';
import { RefreshTokenResponseDto } from 'src/presentation/dto/auth/response/refresh-token.response.dto';
@Injectable()
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

      const findModel = FindUserByIdModel.create(tokenResult.payload.userId);
      const user = await this.authService.findUserById(findModel);

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
