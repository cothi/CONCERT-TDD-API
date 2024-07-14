import { Test, TestingModule } from '@nestjs/testing';
import { Reservation, ReservationStatus } from '@prisma/client';
import { ReservationRepository } from 'src/infrastructure/database/repositories/concerts/reservation.repository';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';
import { CreateConcertModel } from '../../model/concert.model';
import { ReservationService } from '../reservation.service';

describe('ReservationService', () => {
  let service: ReservationService;
  let repository: jest.Mocked<ReservationRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: ReservationRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    repository = module.get(ReservationRepository);
  });

  describe('createReservation', () => {
    it('should create a reservation successfully', async () => {
      const userId = 'user1';
      const seatId = 'seat1';
      const concertDateId = 'concertDate1';
      const concertId = 'concert1';
      const status = ReservationStatus.PENDING;
      const tx = {} as PrismaTransaction; // Mock transaction object

      const mockReservation: Reservation = {
        id: 'reservation1',
        userId,
        seatId,
        concertDateId,
        concertId,
        status,
        expiresAt: expect.any(Date),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.create.mockResolvedValue(mockReservation);

      const concertModel = new CreateConcertModel(
        userId,
        seatId,
        concertDateId,
        concertId,
      );

      const result = await service.createReservation(concertModel);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user: { connect: { id: userId } },
          seat: { connect: { id: seatId } },
          concertDate: { connect: { id: concertDateId } },
          concert: { connect: { id: concertId } },
          status: status,
          expiresAt: expect.any(Date),
        }),
        tx,
      );

      expect(result).toEqual(mockReservation);
    });
  });
});
