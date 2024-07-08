import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { IUseCase } from 'src/application/auth/interfaces/use-case.interface';
import { REGISTER_USER_USE_CASE } from 'src/application/auth/symbol/register-user.use-case.symbol';
import { RegisterUserModel } from 'src/domain/auth/model/register-user.model';
import { LoginDto } from 'src/presentation/dto/auth/request/login.request.dto';
import { TokenRefreshDto } from 'src/presentation/dto/auth/request/refresh.request.dto';
import { RegisterUserDto } from 'src/presentation/dto/auth/request/register-user.dto';
import { AuthResponseDto } from 'src/presentation/dto/auth/response/auth.response.dto';
import { mockLoginResponse, mockRegisterResponse } from 'src/shared/mocked/auth.mock.data';

/**
 * 인증 관련 요청을 처리하는 컨트롤러
 * 로그인, 회원가입, 토큰 갱신 기능을 제공합니다.
 */
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(REGISTER_USER_USE_CASE)
    private readonly registerUserUseCase: IUseCase<RegisterUserModel, AuthResponseDto>,
  ) {}

  /**
   * 사용자 로그인을 처리합니다.
   * @param loginDto 로그인 정보를 담은 DTO
   * @returns 인증 응답 DTO (액세스 토큰 및 리프레시 토큰 포함)
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    // TODO: 실제 로그인 로직 구현
    // 현재는 목업 데이터를 반환합니다.

    return mockLoginResponse;
  }

  /**
   * 새로운 사용자 등록을 처리합니다.
   * @param registerDto 사용자 등록 정보를 담은 DTO
   * @returns 인증 응답 DTO (액세스 토큰 및 리프레시 토큰 포함)
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterUserDto): Promise<AuthResponseDto> {
    return await this.registerUserUseCase.execute(RegisterUserModel.create(registerDto.email));
  }

  /**
   * 액세스 토큰을 갱신합니다.
   * @param refreshDto 리프레시 토큰을 담은 DTO
   * @returns 새로운 인증 응답 DTO (새로운 액세스 토큰 및 리프레시 토큰 포함)
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshDto: TokenRefreshDto): Promise<AuthResponseDto> {
    // TODO: 실제 토큰 갱신 로직 구현
    // 현재는 목업 데이터를 반환합니다.
    return mockRegisterResponse;
  }
}