import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { ChargePointCommand } from 'src/application/points/dto/charge-point.command.dto';
import { GetUserPointQuery } from 'src/application/points/dto/get-user-point.query.dto';
import { ChargePointUseCase } from 'src/application/points/use-cases/charge-point.use-case';
import { QueryUserPointUseCase } from 'src/application/points/use-cases/query-user-point.user-case';
import { Payload } from 'src/common/decorators/token.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-token.interface';
import { ChargePointRequestDto } from 'src/presentation/dto/points/request/charge-point.request.dto';
import { ChargePointResponseDto } from 'src/presentation/dto/points/response/charge-point.response.dto';
import { QueryUserPointResponseDto } from 'src/presentation/dto/points/response/query-user-point.response.dto';

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
  @ApiOperation({
    summary: '포인트 잔액 조회',
    description: '현재 사용자의 포인트 잔액을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '포인트 잔액 정보',
    type: QueryUserPointResponseDto,
  })
  async getPoints(
    @Payload() payload: JwtPayload,
  ): Promise<QueryUserPointResponseDto> {
    const query = GetUserPointQuery.create(payload.userId);
    return await this.quertyUserPointUseCase.execute(query);
  }

  @Patch('charge')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '포인트 충전',
    description:
      '사용자의 포인트를 충전합니다. 동시 요청 시 순차적으로 처리됩니다.',
  })
  @ApiBody({
    type: ChargePointRequestDto,
    description: '충전할 포인트 양',
    examples: {
      sample: {
        value: { amount: 1000 },
        summary: '1000 포인트 충전 요청',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '충전 후 업데이트된 포인트 정보',
    type: ChargePointResponseDto,
  })
  async patchPoints(
    @Body() chargePointRequest: ChargePointRequestDto,
    @Payload() payload: JwtPayload,
  ): Promise<ChargePointResponseDto> {
    const command = ChargePointCommand.create(
      new Decimal(chargePointRequest.amount),
      payload.userId,
    );

    return this.chargePointUseCase.execute(command);
  }
}
