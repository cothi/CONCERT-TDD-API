import { Module } from '@nestjs/common';
import { ReservationController } from '../presentation/controller/reservation/reservation.controller';

@Module({
  imports: [],
  controllers: [ReservationController],
  providers: [],
})
export class ReservationModule {}
