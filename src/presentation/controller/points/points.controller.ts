import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { ChargePointCommand } from 'src/application/points/dto/charge-point.command.dto';
import { GetUserPointQuery } from 'src/application/points/dto/get-user-point.query.dto';
import { ChargePointUseCase } from 'src/application/points/user-cases/charge-point.user-case';
import { QueryUserPointUseCase } from 'src/application/points/user-cases/query-user-point.user-case';
import { Payload } from 'src/common/decorators/token.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-token.interface';
import { ChargePointRequestDto } from 'src/presentation/dto/points/request/charge-point.request.dto';
import { ChargePointResponseDto } from 'src/presentation/dto/points/response/charge-point.response.dto';

/**
 * 포인트 관련 요청을 처리하는 컨트롤러
 * 포인트 조회 및 충전 기능을 제공합니다.
 */
@Controller('points')
export class PointsController {
  constructor(
    private readonly chargePointUseCase: ChargePointUseCase,
    private readonly quertyUserPointUseCase: QueryUserPointUseCase,
  ) {}

  /**
   * 현재 사용자의 포인트 잔액을 조회합니다.
   * @returns 포인트 잔액 정보
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getPoints(@Payload() payload: JwtPayload) {
    // TODO: 실제 포인트 조회 로직 구현
    // 현재는 목업 데이터를 반환합니다.
    const query = GetUserPointQuery.create(payload.userId);
    return await this.quertyUserPointUseCase.execute(query);
  }

  /**
   * 사용자의 포인트를 충전합니다.
   * @param body 충전할 포인트 양을 포함하는 객체
   * @returns 충전 후 업데이트된 포인트 정보
   */
  @Patch('charge')
  @UseGuards(JwtAuthGuard)
  async patchPoints(
    @Body() chargePointRequest: ChargePointRequestDto,
    @Payload() payload: JwtPayload,
  ): Promise<ChargePointResponseDto> {
    // TODO: 실제 포인트 충전 로직 구현
    // 현재는 목업 데이터를 반환합니다.
    const command = ChargePointCommand.create(
      new Decimal(chargePointRequest.amount),
      payload.userId,
    );

    return this.chargePointUseCase.execute(command);
  }
}
