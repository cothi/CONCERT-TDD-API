import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConcertService } from 'src/domain/concerts/services/concert.service';
import { DatabaseModule } from 'src/infrastructure/prisma/prisma.module';
import { ConcertRepository } from 'src/infrastructure/database/repositories/concerts/concert.repository';
import { ConcertsController } from 'src/presentation/controller/concerts/concerts.controller';
import { CreateConcertUseCase } from '../application/concerts/use-cases/create-concert.use-case';
import { CreateConcertDateUseCase } from 'src/application/concerts/use-cases/create-concert-date.use-case';
import { ConcertDateService } from 'src/domain/concerts/services/concert-date.service';
import { ConcertDateRepository } from 'src/infrastructure/database/repositories/concerts/concert-date.repository';
import { CreateSeatUseCase } from 'src/application/concerts/use-cases/create-seat.use-case';
import { SeatRepository } from 'src/infrastructure/database/repositories/concerts/seat.repository';
import { SeatService } from 'src/domain/concerts/services/seat.service';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [ConcertsController],
  providers: [
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
