import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CreateConcertDateUseCase } from 'src/application/concerts/use-cases/create-concert-date.use-case';
import { CreateSeatUseCase } from 'src/application/concerts/use-cases/create-seat.use-case';
import { ReserveSeatUseCase } from 'src/application/concerts/use-cases/reserve-seat.user-case';
import { ConcertDateService } from 'src/domain/concerts/services/concert-date.service';
import { ConcertService } from 'src/domain/concerts/services/concert.service';
import { ReservationService } from 'src/domain/concerts/services/reservation.service';
import { SeatService } from 'src/domain/concerts/services/seat.service';
import { ConcertDateRepository } from 'src/infrastructure/database/repositories/concerts/concert-date.repository';
import { ConcertRepository } from 'src/infrastructure/database/repositories/concerts/concert.repository';
import { ReservationRepository } from 'src/infrastructure/database/repositories/concerts/reservation.repository';
import { SeatRepository } from 'src/infrastructure/database/repositories/concerts/seat.repository';
import { DatabaseModule } from 'src/infrastructure/prisma/prisma.module';
import { ConcertsController } from 'src/presentation/controller/concerts/concerts.controller';
import { CreateConcertUseCase } from '../application/concerts/use-cases/create-concert.use-case';
import { EnqueueModule } from './enqueue.module';
import { GetUserReservationsUseCase } from 'src/application/concerts/use-cases/get-user-reservation.use-case';

@Module({
  imports: [DatabaseModule, JwtModule, EnqueueModule],
  controllers: [ConcertsController],
  providers: [
    GetUserReservationsUseCase,
    CreateConcertDateUseCase,
    CreateConcertUseCase,
    CreateSeatUseCase,
    ReserveSeatUseCase,
    ConcertDateService,
    ReservationService,
    SeatService,
    ConcertService,
    ReservationRepository,
    ConcertRepository,
    ConcertDateRepository,
    SeatRepository,
  ],
})
export class ConcertsModule {}
