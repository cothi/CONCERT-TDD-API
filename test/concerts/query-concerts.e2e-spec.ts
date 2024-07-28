import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { AppModule } from 'src/modules/app.module';
import { createApiRequests } from '../helpers/api-requests';
import { QueueEntryStatus } from '@prisma/client';

describe('콘서트', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let apiRequest: ReturnType<typeof createApiRequests>;
  const seatTotal = 100;
  // const seatPrice = 1;
  // const chargePoint = 1;
  const date = new Date();
  const testContext: {
    testUserId?: string;
    accessToken?: string;
    email?: string;
  } = {};

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    prismaService = app.get<PrismaService>(PrismaService);
    await app.init();
    apiRequest = createApiRequests(app);

    const testUser = await prismaService.user.create({
      data: {
        email: `user${randomUUID()}@example.com`,
      },
    });

    testContext.testUserId = testUser.id;
    testContext.email = testUser.email;
    const loginResponse = await apiRequest.loginRequest(testContext.email);
    testContext.accessToken = loginResponse.body.accessToken;

    await prismaService.queueEntry.create({
      data: {
        userId: testContext.testUserId,
        status: QueueEntryStatus.ELIGIBLE,
        enteredAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5분
      },
    });
  });

  describe('콘서트 날짜 좌석 조회 - /concerts/dates/:concertDateId/seats (GET)', () => {
    it('콘서트 날짜 좌석 조회가 정상적으로 이루어져야 합니다.', async () => {
      const concertName = 'test concert13';
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );
      expect(concertResponse.status).toBe(201);

      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        concertResponse.body.concertId,
        seatTotal,
        testContext.accessToken,
      );
      expect(concertDateResponse.status).toBe(201);
      const concertDateSeatResponse =
        await apiRequest.createConcertDateSeatRequest(
          testContext.accessToken,
          concertDateResponse.body.concertDateId,
          1,
          1,
        );
      expect(concertDateSeatResponse.status).toBe(201);

      const getConcertDateSeatResponse =
        await apiRequest.getConcertSeatsRequest(
          concertDateResponse.body.concertDateId,
          testContext.accessToken,
        );
      expect(getConcertDateSeatResponse.status).toBe(200);
    });

    it('콘서트 날짜 좌석 조회 시 콘서트 날짜 아이디가 없으면 에러가 발생해야 합니다.', async () => {
      const concertDateSeatResponse = await apiRequest.getConcertSeatsRequest(
        '',
        testContext.accessToken,
      );
      expect(concertDateSeatResponse.status).toBe(404);
    });

    it('콘서트 날짜 좌석 조회 시 토큰이 없으면 에러가 발생해야 합니다.', async () => {
      const concertName = 'test concert14';
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );
      expect(concertResponse.status).toBe(201);

      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        concertResponse.body.concertId,
        seatTotal,
        testContext.accessToken,
      );
      expect(concertDateResponse.status).toBe(201);

      const concertDateSeatResponse = await apiRequest.getConcertSeatsRequest(
        concertDateResponse.body.concertDateId,
        '',
      );
      expect(concertDateSeatResponse.status).toBe(401);
    });

    it('콘서트 날짜 좌석 조회 시 콘서트 날짜가 없으면 에러가 발생해야 합니다.', async () => {
      const concertDateSeatResponse = await apiRequest.getConcertSeatsRequest(
        randomUUID(),
        testContext.accessToken,
      );
      expect(concertDateSeatResponse.status).toBe(404);
    });
  });

  describe('콘서트 예약 조회 - /concerts/seats/reserve (GET)', () => {
    it('콘서트 예약 조회가 정상적으로 이루어져야 합니다.', async () => {
      const concertName = 'test concert15';
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );
      expect(concertResponse.status).toBe(201);

      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        concertResponse.body.concertId,
        seatTotal,
        testContext.accessToken,
      );
      expect(concertDateResponse.status).toBe(201);

      const concertDateSeatResponse =
        await apiRequest.createConcertDateSeatRequest(
          testContext.accessToken,
          concertDateResponse.body.concertDateId,
          1,
          1,
        );
      expect(concertDateSeatResponse.status).toBe(201);

      const getSeatsResponse = await apiRequest.getConcertSeatsRequest(
        concertDateResponse.body.concertDateId,
        testContext.accessToken,
      );
      const seatId = getSeatsResponse.body.seats[0].seatId;

      const reserveSeatResponse = await apiRequest.reserveSeatRequest(
        testContext.accessToken,
        seatId,
      );

      expect(reserveSeatResponse.status).toBe(201);

      const getReservationResponse = await apiRequest.getReservationRequest(
        testContext.accessToken,
      );
      expect(getReservationResponse.status).toBe(200);
    });
    it('콘서트 예약 조회 시 토큰이 없으면 에러가 발생해야 합니다.', async () => {
      const getReservationResponse = await apiRequest.getReservationRequest('');
      expect(getReservationResponse.status).toBe(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
