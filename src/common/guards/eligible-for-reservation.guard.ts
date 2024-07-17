import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { QueueEntryRepository } from 'src/infrastructure/database/repositories/enqueue/queue.repository';

@Injectable()
export class EligibleForReservationGuard implements CanActivate {
  constructor(private readonly queueEntryRepository: QueueEntryRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const payload = request['payload']; // JwtAuthGuard에서 설정한 payload

      if (!payload || !payload.userId) {
        throw new HttpException(
          '사용자 정보가 없습니다.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      await this.checkEligibility(payload.userId);
      return true;
    } catch (error) {
      throw error;
    }
  }

  private async checkEligibility(userId: string): Promise<boolean> {
    const queueEntry = await this.queueEntryRepository.findByUserId(userId);
    if (!queueEntry) {
      throw new HttpException(
        '유저가 대기열 안에 존재하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (queueEntry.status !== 'ELIGIBLE') {
      throw new HttpException(
        '유저가 대기열 안에 있으나, 예약 대기열에서 예약할 수 있는 상태가 아닙니다',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return true;
  }
}
