import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  mockAvailableDatesReservation,
  mockReservationSeat,
  mockSeatsReservation,
} from 'src/shared/mocked/reservation.mock.data';

/**
 * 예약 관련 요청을 처리하는 컨트롤러
 * 예약 가능 날짜 조회, 좌석 조회, 좌석 예약 기능을 제공합니다.
 */
@Controller('reservation')
export class ReservationController {
  /**
   * 예약 가능한 날짜 목록을 조회합니다.
   * @returns 예약 가능한 날짜 목록
   */
  @Get('available-date')
  async availableDates() {
    // TODO: 실제 예약 가능 날짜 조회 로직 구현
    // 현재는 목업 데이터를 반환합니다.
    return mockAvailableDatesReservation;
  }

  /**
   * 특정 콘서트의 예약 가능한 좌석 목록을 조회합니다.
   * @param concertId 조회할 콘서트의 고유 ID
   * @returns 예약 가능한 좌석 목록
   */
  @Get(':concertId/seats')
  async seats(@Param('concertId') concertId: string) {
    // TODO: 실제 좌석 조회 로직 구현
    // 현재는 목업 데이터를 반환합니다.
    return mockSeatsReservation;
  }

  /**
   * 좌석을 예약합니다.
   * @param seatRequest 좌석 예약 요청 정보를 담은 DTO
   * @returns 예약 결과
   */
  @Post('seat')
  async reserveSeat(@Body() seatRequest: any) {
    // TODO: 실제 좌석 예약 로직 구현
    // 현재는 목업 데이터를 반환합니다.
    return mockReservationSeat;
  }
}
