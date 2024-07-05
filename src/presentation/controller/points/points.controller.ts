import { Body, Controller, Get, Patch } from '@nestjs/common';
import { mockGetPoints, mockPatchPoints } from 'src/shared/mocked/points.mock.data';

/**
 * 포인트 관련 요청을 처리하는 컨트롤러
 * 포인트 조회 및 충전 기능을 제공합니다.
 */
@Controller('points')
export class PointsController {
  /**
   * 현재 사용자의 포인트 잔액을 조회합니다.
   * @returns 포인트 잔액 정보
   */
  @Get()
  async getPoints() {
    // TODO: 실제 포인트 조회 로직 구현
    // 현재는 목업 데이터를 반환합니다.
    return mockGetPoints;
  }

  /**
   * 사용자의 포인트를 충전합니다.
   * @param body 충전할 포인트 양을 포함하는 객체
   * @returns 충전 후 업데이트된 포인트 정보
   */
  @Patch('charge')

  async patchPoints(@Body() body: { amount: number }) {
    // TODO: 실제 포인트 충전 로직 구현
    // 현재는 목업 데이터를 반환합니다.
    return mockPatchPoints;
  }
}
