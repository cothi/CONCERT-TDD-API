import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ReservationRepository } from 'src/infrastructure/concerts/repositories/reservation.repository';
import {
  CreateReservationModel,
  GetReservationByIdModel,
  ReservationModel,
  UpdateReservationModel,
} from '../../model/reservation.model';
import { ReservationService } from '../reservation.service';

describe('ReservationService', () => {
  let service: ReservationService;
  let repository: jest.Mocked<ReservationRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      getReservationById: jest.fn(),
      getReservationByWithLock: jest.fn(),
      updateStatus: jest.fn(),
      findByUserId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        { provide: ReservationRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    repository = module.get(ReservationRepository);
  });

  it('예약을 생성해야 한다', async () => {
    const createModel = new CreateReservationModel();
    const expectedReservation = new ReservationModel();
    repository.create.mockResolvedValue(expectedReservation);

    const result = await service.createReservation(createModel);

    expect(repository.create).toHaveBeenCalledWith(createModel, undefined);
    expect(result).toBe(expectedReservation);
  });

  it('ID로 예약을 조회해야 한다', async () => {
    const getModel = new GetReservationByIdModel();
    const expectedReservation = new ReservationModel();
    repository.getReservationById.mockResolvedValue(expectedReservation);

    const result = await service.getReservationById(getModel);

    expect(repository.getReservationById).toHaveBeenCalledWith(
      getModel,
      undefined,
    );
    expect(result).toBe(expectedReservation);
  });

  it('존재하지 않는 예약 조회 시 예외를 던져야 한다', async () => {
    const getModel = new GetReservationByIdModel();
    repository.getReservationById.mockResolvedValue(null);

    await expect(service.getReservationById(getModel)).rejects.toThrow(
      HttpException,
    );
  });

  it('락을 사용하여 예약을 조회해야 한다', async () => {
    const getModel = new GetReservationByIdModel();
    const expectedReservation = new ReservationModel();
    repository.getReservationByWithLock.mockResolvedValue(expectedReservation);

    const result = await service.getReservationByWithLock(getModel);

    expect(repository.getReservationByWithLock).toHaveBeenCalledWith(
      getModel,
      undefined,
    );
    expect(result).toBe(expectedReservation);
  });

  it('예약 상태를 업데이트해야 한다', async () => {
    const updateModel = new UpdateReservationModel();
    const expectedReservation = new ReservationModel();
    repository.getReservationById.mockResolvedValue(new ReservationModel());
    repository.updateStatus.mockResolvedValue(expectedReservation);

    const result = await service.updateStatus(updateModel);

    expect(repository.updateStatus).toHaveBeenCalledWith(
      updateModel,
      undefined,
    );
    expect(result).toBe(expectedReservation);
  });
});
