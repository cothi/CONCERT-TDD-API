import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/interfaces/use-case.interface';
import { QueueService } from 'src/domain/enqueue/services/enqueue.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { EnqueueDto } from 'src/presentation/dto/enqueue/request/enqueue.dto';
import { QueueStatusResponseDto } from 'src/presentation/dto/enqueue/response/enqueue-status.reponse.dto';
@Injectable()
export class EnqueueUseCase
  implements IUseCase<EnqueueDto, QueueStatusResponseDto>
{
  constructor(
    private readonly queueService: QueueService,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(dto: EnqueueDto): Promise<QueueStatusResponseDto> {
    const responseDto = await this.prismaService.$transaction(
      async (prisma) => {
        const findQueueEntry = await this.queueService.getQueueEntryWithLock(
          dto.userId,
          prisma,
        );
        if (findQueueEntry) {
          throw new Error('User already in queue');
        }
        const queueEntry = await this.queueService.enqueue(dto.userId, prisma);
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
