import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConcertService } from 'src/domain/concerts/services/concert.service';
import { DatabaseModule } from 'src/infrastructure/database/prisma.module';
import { ConcertRepository } from 'src/infrastructure/database/repositories/concerts/concert.repository';
import { ConcertsController } from 'src/presentation/controller/concerts/concerts.controller';
import { CreateConcertUseCase } from '../application/concerts/use-cases/create-concert.use-case';
import { CreateConcertDateUseCase } from 'src/application/concerts/use-cases/create-concert-date.use-case';
import { ConcertDateService } from 'src/domain/concerts/services/concert-date.service';
import { ConcertDateRepository } from 'src/infrastructure/database/repositories/concerts/concert-date.repository';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [ConcertsController],
  providers: [
    CreateConcertDateUseCase,
    CreateConcertUseCase,
    ConcertService,
    ConcertDateService,
    ConcertRepository,
    ConcertDateRepository,
  ],
})
export class ConcertsModule {}
