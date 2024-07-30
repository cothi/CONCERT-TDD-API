import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { QueueEntryRepository } from 'src/infrastructure/enqueue/repository/queue.repository';
import { ErrorCode } from '../enums/error-code.enum';
import { ErrorFactory } from '../errors/error-factory.error';

@Injectable()
export class EligibleForReservationGuard implements CanActivate {
  constructor(private readonly queueEntryRepository: QueueEntryRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const payload = request['payload']; // JwtAuthGuard에서 설정한 payload

      if (!payload || !payload.userId) {
        throw ErrorFactory.createException(ErrorCode.UNAUTHORIZED);
      }

      await this.checkEligibility(payload.userId);
      return true;
    } catch (error) {
      throw error;
    }
  }

  private async checkEligibility(userId: string): Promise<boolean> {
    // const getModel = GetQueueEntryByUserIdModel.create(userId);
    const queueEntry =
      await this.queueEntryRepository.getReservationPermission(userId);
    if (!queueEntry) {
      throw ErrorFactory.createException(ErrorCode.UNAUTHORIZED);
    }
    return true;
  }
}
