import { PickType } from '@nestjs/swagger';
import { CreateSeatDto } from 'src/presentation/dto/concerts/dto/request/create-seat.dto';

export class CreateSeatCommand extends PickType(CreateSeatDto, [
  'seatNumber',
  'price',
]) {
  concertDateId: string;
}
