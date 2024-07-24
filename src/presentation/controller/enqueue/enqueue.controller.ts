// src/presentation/controllers/enqueue.controller.ts
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'jsonwebtoken';
import { EnqueueUseCase } from 'src/application/enqueue/use-cases/enqueue.use-case';
import { GetQueueStatusUseCase } from 'src/application/enqueue/use-cases/get-queue.use-case';
import { Payload } from 'src/common/decorators/token.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { QueueStatusResponseDto } from 'src/presentation/dto/enqueue/response/enqueue-status.reponse.dto';
import { EnqueueResponseDto } from 'src/presentation/dto/enqueue/response/enqueue.response.dto';
@ApiTags('대기열')
@Controller('enqueue')
export class EnqueueController {
  constructor(
    private enqueueUseCase: EnqueueUseCase,
    private getQueueStatusUseCase: GetQueueStatusUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: '대기열 등록',
    description: '사용자를 대기열에 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '대기열 등록 성공',
    type: EnqueueResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  async enqueue(@Payload() payload: JwtPayload): Promise<EnqueueResponseDto> {
    return await this.enqueueUseCase.execute({ userId: payload.userId });
  }

  @Get()
  @ApiOperation({
    summary: '대기열 상태 조회',
    description: '사용자의 현재 대기열 상태를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '대기열 상태 조회 성공',
    type: QueueStatusResponseDto,
  })
  @ApiResponse({ status: 404, description: '사용자가 대기열에 없음' })
  @UseGuards(JwtAuthGuard)
  async getQueueStatus(
    @Payload() payload: JwtPayload,
  ): Promise<QueueStatusResponseDto> {
    return await this.getQueueStatusUseCase.execute(payload.userId);
  }
}
