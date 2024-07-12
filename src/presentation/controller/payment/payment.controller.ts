import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { mockPay } from 'src/common/shared/mocked/payment.mock.data';

/**
 * 결제 관련 요청을 처리하는 컨트롤러
 * 결제 처리 기능을 제공합니다.
 */
@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  /**
   * 결제를 처리합니다.
   * @param paymentDto 결제 정보를 담은 DTO
   * @returns 결제 처리 결과
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async pay(@Body() paymentDto: any) {
    // TODO: 실제 결제 처리 로직 구현
    // 현재는 목업 데이터를 반환합니다.
    return mockPay;
  }
}
