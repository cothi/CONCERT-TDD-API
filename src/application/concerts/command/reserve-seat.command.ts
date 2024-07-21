import { PickType } from '@nestjs/swagger';
import { ReserveSeatDto } from 'src/presentation/dto/concerts/dto/request/reserve-seat.dto';

export class ReserveSeatCommand extends PickType(ReserveSeatDto, ['seatId']) {
  userId: string;
}
