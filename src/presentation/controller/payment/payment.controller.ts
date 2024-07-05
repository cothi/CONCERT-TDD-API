import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PaymentRequestDto } from 'src/presentation/dto/request/payment/payment.request.dto';
import { mockPay } from 'src/shared/mocked/payment.mock.data';

/**
 * 결제 관련 요청을 처리하는 컨트롤러
 * 결제 처리 기능을 제공합니다.
 */
@Controller('payment')
export class PaymentController {
  /**
   * 결제를 처리합니다.
   * @param paymentDto 결제 정보를 담은 DTO
   * @returns 결제 처리 결과
   */
  @Post()
  @HttpCode(HttpStatus.OK)

  async pay(@Body() paymentDto: PaymentRequestDto) {
    // TODO: 실제 결제 처리 로직 구현
    // 현재는 목업 데이터를 반환합니다.
    return mockPay;
  }
}
