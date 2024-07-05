import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { mockQueueEntryResponse, mockQueueResponse } from 'src/shared/mocked/concerts.mock.data';

/**
 * 콘서트 관련 요청을 처리하는 컨트롤러
 * 콘서트 대기열 입장 및 대기열 상태 조회 기능을 제공합니다.
 */
@Controller('concerts')
export class ConcertsController {
  /**
   * 특정 콘서트의 대기열에 입장합니다.
   * @param concertId 대기열에 입장하려는 콘서트의 고유 ID
   * @returns 대기열 입장 결과 (대기 번호 등의 정보 포함)
   */
  @Get(':concertId/queue-entry')
  @HttpCode(HttpStatus.CREATED)

  async queueEntry(@Param('concertId') concertId: string) {
    // TODO: 실제 대기열 입장 로직 구현
    // 현재는 목업 데이터를 반환합니다.
    return mockQueueEntryResponse;
  }

  /**
   * 전체 콘서트 대기열 상태를 조회합니다.
   * @returns 모든 콘서트의 대기열 상태 정보
   */
  @Get('queue')
  @HttpCode(HttpStatus.OK)

  async queue() {
    // TODO: 실제 대기열 상태 조회 로직 구현
    // 현재는 목업 데이터를 반환합니다.
    return mockQueueResponse;
  }
}
