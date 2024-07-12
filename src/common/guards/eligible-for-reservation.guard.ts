import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { QueueEntryRepository } from 'src/infrastructure/database/repositories/enqueue/queue.repository';

@Injectable()
export class EligibleForReservationGuard implements CanActivate {
  constructor(private readonly queueEntryRepository: QueueEntryRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload = request['payload']; // JwtAuthGuard에서 설정한 payload

    if (!payload || !payload.userId) {
      throw new UnauthorizedException('Invalid user information');
    }

    return this.checkEligibility(payload.userId);
  }

  private async checkEligibility(userId: string): Promise<boolean> {
    const queueEntry = await this.queueEntryRepository.findByUserId(userId);
    if (!queueEntry) {
      throw new UnauthorizedException('유저가 대기열 안에 존재하지 않습니다.');
    }
    return queueEntry.status === 'ELIGIBLE';
  }
}
