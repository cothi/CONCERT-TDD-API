// src/domain/concerts/services/__tests__/reservation.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from '../reservation.service';
import { ReservationRepository } from 'src/infrastructure/concerts/reservation.repository';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';
import { Reservation, ReservationStatus } from '@prisma/client';
import {
  CreateReservationModel,
  GetReservationByIdModel,
  GetUserReservationsModel,
  UpdateReservationModel,
} from '../../model/reservation.model';
// src/domain/concerts/types/reservation.types.ts

import { Concert, ConcertDate, Seat } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export type ReservationWithRelations = Reservation & {
  concert: Pick<Concert, 'name'>;
  concertDate: Pick<ConcertDate, 'date'>;
  seat: Pick<Seat, 'seatNumber' | 'price'>;
};

describe('ReservationService', () => {
  let service: ReservationService;
  let repository: jest.Mocked<ReservationRepository>;

  const mockReservation: Reservation = {
    id: '1',
    userId: 'user1',
    concertId: 'concert1',
    seatId: 'seat1',
    status: ReservationStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
    expiresAt: new Date(),
    concertDateId: 'concertDate1',
  };
  const mockReservationWithRelations: ReservationWithRelations = {
    ...mockReservation,
    seat: { price: new Decimal(100), seatNumber: 1 },
    concert: { name: 'concert1' },
    concertDate: { date: new Date() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: ReservationRepository,
          useValue: {
            create: jest.fn(),
            getReservationById: jest.fn(),
            updateStatus: jest.fn(),
            findByUserId: jest.fn(),
            getReservationByWithLock: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    repository = module.get(ReservationRepository);
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('createReservation', () => {
    it('예약을 성공적으로 생성해야 한다', async () => {
      const createModel: CreateReservationModel = {
        userId: 'user1',
        concertId: 'concert1',
        seatId: 'seat1',
        status: ReservationStatus.PENDING,
        concertDateId: 'concertDate1',
        expireAt: new Date(),
      };
      const tx = {} as PrismaTransaction;

      repository.create.mockResolvedValue(mockReservation);

      const result = await service.createReservation(createModel, tx);

      expect(repository.create).toHaveBeenCalledWith(createModel, tx);
      expect(result).toEqual(mockReservation);
    });

    it('생성 실패 시 에러를 던져야 한다', async () => {
      const createModel: CreateReservationModel = {
        userId: 'user1',
        concertId: 'concert1',
        seatId: 'seat1',
        status: ReservationStatus.PENDING,
        concertDateId: 'concertDate1',
        expireAt: new Date(),
      };

      repository.create.mockRejectedValue(new Error('Database error'));

      await expect(service.createReservation(createModel)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('getReservationById', () => {
    it('ID로 예약을 조회해야 한다', async () => {
      const getModel: GetReservationByIdModel = { reservationId: '1' };
      const tx = {} as PrismaTransaction;

      repository.getReservationById.mockResolvedValue(mockReservation);

      const result = await service.getReservationById(getModel, tx);

      expect(repository.getReservationById).toHaveBeenCalledWith(getModel, tx);
      expect(result).toEqual(mockReservation);
    });
  });
  describe('getReservationByIdWithLock', () => {
    it('ID로 예약을 조회해야 한다', async () => {
      const getModel: GetReservationByIdModel = { reservationId: '1' };
      const tx = {} as PrismaTransaction;
      repository.getReservationByWithLock.mockResolvedValue(mockReservation);

      const result = await service.getReservationByWithLock(getModel, tx);

      expect(repository.getReservationByWithLock).toHaveBeenCalledWith(
        getModel,
        tx,
      );
      expect(result).toEqual(mockReservation);
    });
  });

  describe('updateStatus', () => {
    it('예약 상태를 업데이트해야 한다', async () => {
      const updateModel: UpdateReservationModel = {
        reservationId: '1',
        status: ReservationStatus.CONFIRMED,
      };
      const tx = {} as PrismaTransaction;

      const updatedReservation = {
        ...mockReservation,
        status: ReservationStatus.CONFIRMED,
      };
      repository.updateStatus.mockResolvedValue(updatedReservation);
      repository.getReservationById.mockResolvedValue(mockReservation);

      const result = await service.updateStatus(updateModel, tx);

      expect(repository.updateStatus).toHaveBeenCalledWith(updateModel, tx);
      expect(result).toEqual(updatedReservation);
    });
  });

  describe('getUserReservations', () => {
    it('사용자의 예약 목록을 조회해야 한다', async () => {
      const getUserModel: GetUserReservationsModel = { userId: 'user1' };

      repository.findByUserId.mockResolvedValue([mockReservationWithRelations]);

      const result = await service.getUserReservations(getUserModel);

      expect(repository.findByUserId).toHaveBeenCalledWith(getUserModel);
      expect(result).toEqual([mockReservationWithRelations]);
    });
  });
});
