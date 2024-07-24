import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { QueueEntryStatus } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { AppModule } from 'src/modules/app.module';
import { createApiRequests } from '../helpers/api-requests';
import { randomUUID } from 'crypto';

describe('Payment Test (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  const testContext: {
    testUserId?: string;
    accessToken?: string;
    email?: string;
  } = {};
  let apiRequests: ReturnType<typeof createApiRequests>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get<PrismaService>(PrismaService);
    await app.init();
    apiRequests = createApiRequests(app);

    // 테스트 사용자 생성
    const testUser = await prismaService.user.create({
      data: {
        // 랜덤 이메일
        email: `user${randomUUID()}@example.com`,
      },
    });
    testContext.testUserId = testUser.id;
    testContext.email = testUser.email;
    // 테스트용 대기열 항목 생성
    await prismaService.queueEntry.create({
      data: {
        userId: testContext.testUserId,
        status: QueueEntryStatus.ELIGIBLE,
        enteredAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5분
      },
    });
    const loginResponse = await apiRequests.loginRequest(testContext.email);
    testContext.accessToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });
  describe('결제', () => {
    it('결제가 정상적으로 이루어져야 합니다. - /payment (POST)', async () => {
      // 테스트 코드 작성
      const concertName = `test concert ${randomUUID()}`;
      const seatTotal = 100;
      const seatPrice = 1;
      const chargePoint = 1;
      const concertDate = new Date();
      const accessToken = testContext.accessToken;

      // 포인트 충전
      await apiRequests.chargePointRequest(accessToken, chargePoint);

      // 콘서트 생성
      const createConcertRes = await apiRequests.createConcertRequest(
        accessToken,
        concertName,
      );
      expect(createConcertRes.status).toBe(201);

      // 콘서트 날짜 생성
      const createConcertDateRes = await apiRequests.createConcertDateRequest(
        concertDate,
        createConcertRes.body.concertId,
        seatTotal,
        accessToken,
      );

      // 콘서트 좌석 생성
      await apiRequests.createConcertDateSeatRequest(
        accessToken,
        createConcertDateRes.body.concertDateId,
        seatTotal,
        seatPrice,
      );

      // 좌석 조회
      const getConcertSeatsRes = await apiRequests.getConcertSeatsRequest(
        createConcertDateRes.body.concertDateId,
        accessToken,
      );
      // 좌석 예약
      const createReservationRes = await apiRequests.createReservationRequest(
        accessToken,
        getConcertSeatsRes.body.seats[0].seatId,
      );

      // 좌석 결제
      const createPaymentRes = await apiRequests.createPaymentRequest(
        accessToken,
        createReservationRes.body.id,
      );
      expect(createPaymentRes.status).toBe(201);
    });

    it('유저가 돈이 없으면 결제가 실패해야 합니다. - /payment (POST)', async () => {
      // 테스트 코드 작성
      const concertName = `test concert ${randomUUID()}`;
      const seatTotal = 100;
      const seatPrice = 1;
      const concertDate = new Date();
      const accessToken = testContext.accessToken;

      // 콘서트 생성
      const createConcertRes = await apiRequests.createConcertRequest(
        accessToken,
        concertName,
      );
      expect(createConcertRes.status).toBe(201);

      // 콘서트 날짜 생성
      const createConcertDateRes = await apiRequests.createConcertDateRequest(
        concertDate,
        createConcertRes.body.concertId,
        seatTotal,
        accessToken,
      );

      // 콘서트 좌석 생성
      await apiRequests.createConcertDateSeatRequest(
        accessToken,
        createConcertDateRes.body.concertDateId,
        seatTotal,
        seatPrice,
      );

      // 좌석 조회
      const getConcertSeatsRes = await apiRequests.getConcertSeatsRequest(
        createConcertDateRes.body.concertDateId,
        accessToken,
      );
      // 좌석 예약
      const createReservationRes = await apiRequests.createReservationRequest(
        accessToken,
        getConcertSeatsRes.body.seats[0].seatId,
      );

      // 좌석 결제
      const createPaymentRes = await apiRequests.createPaymentRequest(
        accessToken,
        createReservationRes.body.id,
      );
      expect(createPaymentRes.status).toBe(406);
    });
  });
});
