import { Injectable, NotFoundException } from '@nestjs/common';
import { QueueService } from 'src/domain/enqueue/services/enqueue.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { QueueStatusResponseDto } from 'src/presentation/dto/enqueue/response/enqueue-status.reponse.dto';

@Injectable()
export class GetQueueStatusUseCase {
  constructor(
    private readonly queueService: QueueService,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(userId: string): Promise<QueueStatusResponseDto> {
    const responseDto = await this.prismaService.$transaction(
      async (prisma) => {
        const queueEntry = await this.queueService.getQueueEntryWithLock(
          userId,
          prisma,
        );

        if (!queueEntry) {
          throw new NotFoundException('유저가 대기열에 없음');
        }

        const queuedAhead = await this.queueService.getQueuedAhead(
          queueEntry.enteredAt,
          prisma,
        );
        const isEligibleForReservation =
          await this.queueService.isEligibleForReservation(
            queueEntry.status,
            prisma,
          );

        return {
          status: queueEntry.status,
          isEligibleForReservation,
          queuedAhead,
          enteredAt: queueEntry.enteredAt,
          expiresAt: queueEntry.expiresAt,
        };
      },
    );

    return responseDto;
  }
}
