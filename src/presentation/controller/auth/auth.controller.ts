import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserUseCase } from 'src/application/auth/use-cases/login-user.use-case';
import { RefreshTokenUseCase } from 'src/application/auth/use-cases/refresh-token.use-case';
import { RegisterUserUseCase } from 'src/application/auth/use-cases/register-user.use-case';
import { LoginUserModel } from 'src/domain/auth/model/login-user.model';
import { RefreshTokenModel } from 'src/domain/auth/model/refresh-token.model';
import { RegisterUserModel } from 'src/domain/auth/model/register-user.model';
import { LoginDto } from 'src/presentation/dto/auth/request/login.request.dto';
import { RefreshTokenDto } from 'src/presentation/dto/auth/request/refresh-token.request.dto';
import { RegisterUserDto } from 'src/presentation/dto/auth/request/register-user.request.dto';
import { AuthResponseDto } from 'src/presentation/dto/auth/response/auth.response.dto';
import { RefreshTokenResponseDto } from 'src/presentation/dto/auth/response/refresh-token.response.dto';

/**
 * 인증 관련 요청을 처리하는 컨트롤러
 * 로그인, 회원가입, 토큰 갱신 기능을 제공합니다.
 */
@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  /**
   * 사용자 로그인을 처리합니다.
   * @param loginDto 로그인 정보를 담은 DTO
   * @returns 인증 응답 DTO (액세스 토큰 및 리프레시 토큰 포함)
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '사용자 로그인',
    description: '이메일을 사용하여 사용자 로그인을 처리합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return await this.loginUserUseCase.execute(
      LoginUserModel.create(loginDto.email),
    );
  }

  /**
   * 새로운 사용자 등록을 처리합니다.
   * @param registerDto 사용자 등록 정보를 담은 DTO
   * @returns 인증 응답 DTO (액세스 토큰 및 리프레시 토큰 포함)
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '사용자 등록',
    description: '새로운 사용자를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '사용자 등록 성공',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async register(
    @Body() registerDto: RegisterUserDto,
  ): Promise<AuthResponseDto> {
    return await this.registerUserUseCase.execute(
      RegisterUserModel.create(registerDto.email),
    );
  }

  /**
   * 액세스 토큰을 갱신합니다.
   * @param refreshDto 리프레시 토큰을 담은 DTO
   * @returns 새로운 인증 응답 DTO (새로운 액세스 토큰 및 리프레시 토큰 포함)
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '토큰 갱신',
    description: '리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.',
  })
  @ApiResponse({
    status: 200,
    description: '토큰 갱신 성공',
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({ status: 401, description: '유효하지 않은 리프레시 토큰' })
  async refresh(
    @Body() refreshDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    return await this.refreshTokenUseCase.execute(
      RefreshTokenModel.create(refreshDto.refreshToken),
    );
  }
}
