import { ProcessPaymentCommand } from './../../../application/payment/command/process-paymnet.command';
import { Body, Controller, Injectable, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProcessPaymentUseCase } from 'src/application/payment/use-case/process-payment.use-case';
import { Payload } from 'src/common/decorators/token.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-token.interface';
import { ProcessPaymentDto } from 'src/presentation/dto/payment/request/process-payment.dto';
import { PaymentResponseDto } from 'src/presentation/dto/payment/response/payment.response.dto';

@ApiTags('결제')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment')
@Injectable()
export class PaymentController {
  constructor(private readonly processPaymentUseCase: ProcessPaymentUseCase) {}

  @Post()
  @ApiOperation({
    summary: '결제 처리',
    description: '티켓 구매를 위한 결제를 처리합니다.',
  })
  @ApiBody({ type: ProcessPaymentDto, description: '결제 처리에 필요한 정보' })
  @ApiResponse({
    status: 201,
    description: '결제 처리 성공',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 409, description: '결제 처리 실패 (잔액 부족 등)' })
  @UseGuards(JwtAuthGuard)
  async processPayment(
    @Body() processPaymentDto: ProcessPaymentDto,
    @Payload() payload: JwtPayload,
  ): Promise<PaymentResponseDto> {
    const command: ProcessPaymentCommand = {
      userId: payload.userId,
      ...processPaymentDto,
    };
    return this.processPaymentUseCase.execute(command);
  }
}
