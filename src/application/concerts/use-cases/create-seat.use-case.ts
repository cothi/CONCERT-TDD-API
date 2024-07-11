import { Injectable } from '@nestjs/common';
import { IUseCase } from 'src/application/auth/interfaces/use-case.interface';
import { CreateSeatResponseDto } from 'src/presentation/dto/concerts/dto/response/create-seat.response.dto';
import { CreateSeatCommand } from '../command/create-seat.command';
import { SeatService } from 'src/domain/concerts/services/seat.service';
import { SeatStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CreateSeatUseCase
  implements IUseCase<CreateSeatCommand, CreateSeatResponseDto>
{
  constructor(private readonly seatService: SeatService) {}
  async execute(input: CreateSeatCommand): Promise<CreateSeatResponseDto> {
    const batch = await this.seatService.createSeat({
      concertDateId: input.concertDateId,
      seatNumber: input.seatNumber,
      status: SeatStatus.AVAILABLE,
      price: new Decimal(input.price),
    });
    return {
      success: true,
      createdSeatsCount: batch.count,
      concertDateId: input.concertDateId,
    };
  }
}
