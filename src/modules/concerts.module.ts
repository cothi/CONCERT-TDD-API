import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CreateConcertDateUseCase } from 'src/application/concerts/use-cases/create-concert-date.use-case';
import { CreateSeatUseCase } from 'src/application/concerts/use-cases/create-seat.use-case';
import { ConcertDateService } from 'src/domain/concerts/services/concert-date.service';
import { ConcertService } from 'src/domain/concerts/services/concert.service';
import { SeatService } from 'src/domain/concerts/services/seat.service';
import { ConcertDateRepository } from 'src/infrastructure/database/repositories/concerts/concert-date.repository';
import { ConcertRepository } from 'src/infrastructure/database/repositories/concerts/concert.repository';
import { SeatRepository } from 'src/infrastructure/database/repositories/concerts/seat.repository';
import { DatabaseModule } from 'src/infrastructure/prisma/prisma.module';
import { ConcertsController } from 'src/presentation/controller/concerts/concerts.controller';
import { CreateConcertUseCase } from '../application/concerts/use-cases/create-concert.use-case';
import { ReserveSeatUseCase } from 'src/application/concerts/use-cases/reserve-seat.user-case';
import { ReservationService } from 'src/domain/concerts/services/reservation.service';
import { ReservationRepository } from 'src/infrastructure/database/repositories/concerts/reservation.repository';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [ConcertsController],
  providers: [
    ReservationService,
    ReservationRepository,
    ReserveSeatUseCase,
    CreateSeatUseCase,
    SeatRepository,
    SeatService,
    CreateConcertDateUseCase,
    CreateConcertUseCase,
    ConcertService,
    ConcertDateService,
    ConcertRepository,
    ConcertDateRepository,
  ],
})
export class ConcertsModule {}
