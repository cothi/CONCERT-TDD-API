import { GetSeatsByConcertIdCommand } from './../command/get-concert-by-concertId.command';
import { Injectable } from '@nestjs/common';
import { GetSeatByConcertDateIdModel } from 'src/domain/concerts/model/seat.model';
import { SeatService } from 'src/domain/concerts/services/seat.service';
import { GetSeatsByConcertIdResponseDto } from 'src/presentation/dto/concerts/dto/response/get-seats-by-concertid.dto';
@Injectable()
export class GetConcertSeatsUseCase {
  constructor(private readonly seatService: SeatService) {}

  async execute(
    command: GetSeatsByConcertIdCommand,
  ): Promise<GetSeatsByConcertIdResponseDto> {
    const model: GetSeatByConcertDateIdModel = {
      concertDateId: command.concertDateId,
    };

    const seats = await this.seatService.getSeatsByConcertDateId(model);

    return GetSeatsByConcertIdResponseDto.fromSeats(seats);
  }
}
