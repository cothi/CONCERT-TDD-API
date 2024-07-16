import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/common/interfaces/use-case.interface';
import { QueueService } from 'src/domain/enqueue/services/enqueue.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { QueueStatusResponseDto } from 'src/presentation/dto/enqueue/response/enqueue-status.reponse.dto';

@Injectable()
export class GetQueueStatusUseCase
  implements IUseCase<string, QueueStatusResponseDto>
{
  constructor(
    private readonly queueService: QueueService,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(userId: string): Promise<QueueStatusResponseDto> {
    try {
      const responseDto = await this.prismaService.$transaction(
        async (prisma) => {
          const queueEntry = await this.queueService.getQueueEntry(userId);

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
    } catch (error) {
      throw error;
    }
  }
}
