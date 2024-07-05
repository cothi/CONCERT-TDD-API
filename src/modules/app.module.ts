import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { ReservationModule } from './reservation.module';
import { ConcertsModule } from './concerts.module';

@Module({
  imports: [AuthModule, ConcertsModule, ReservationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
