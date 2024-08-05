import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { AppModule } from 'src/modules/app.module';
import { createApiRequests } from '../helpers/api-requests';
import { randomUUID } from 'crypto';
import { RedisService } from 'src/infrastructure/database/redis/redis.service';

describe('Payment Test (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let redisService: RedisService;
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
    redisService = app.get<RedisService>(RedisService);
    await app.init();
    apiRequests = createApiRequests(app);

    // 테스트 사용자 생성
    const email = `user${randomUUID()}@example.com`;
    const res = await apiRequests.createUserRequest(email);

    const testUser = await prismaService.user.findUnique({
      where: { email: email },
    });
    testContext.testUserId = testUser.id;
    testContext.email = testUser.email;
    testContext.accessToken = res.body.data.accessToken;

    // 대기열 추가
    await redisService.grantReservationPermissions([testUser.id]);
  });

  describe('결제', () => {
    it('결제가 정상적으로 이루어져야 합니다. - /payment (POST)', async () => {
      const concertName = `test concert ${randomUUID()}`;
      const seatTotal = 100;
      const seatPrice = 1;
      const chargePoint = 1;
      const concertDate = new Date();
      const accessToken = testContext.accessToken;

      // 포인트 충전
      const chargePointRes = await apiRequests.chargePointRequest(
        accessToken,
        chargePoint,
      );
      expect(chargePointRes.body.statusCode).toBe(200);

      // 콘서트 생성
      const createConcertRes = await apiRequests.createConcertRequest(
        accessToken,
        concertName,
      );
      expect(createConcertRes.body.statusCode).toBe(201);

      // 콘서트 날짜 생성
      const createConcertDateRes = await apiRequests.createConcertDateRequest(
        concertDate,
        createConcertRes.body.data.concertId,
        seatTotal,
        accessToken,
      );
      expect(createConcertDateRes.body.statusCode).toBe(201);

      // 콘서트 좌석 생성
      const createSeatRes = await apiRequests.createConcertDateSeatRequest(
        accessToken,
        createConcertDateRes.body.data.concertDateId,
        seatTotal,
        seatPrice,
      );
      expect(createSeatRes.body.statusCode).toBe(201);

      // 좌석 조회
      const getConcertSeatsRes = await apiRequests.getConcertSeatsRequest(
        createConcertDateRes.body.data.concertDateId,
        accessToken,
      );
      expect(getConcertSeatsRes.body.statusCode).toBe(200);

      // 좌석 예약
      const createReservationRes = await apiRequests.createReservationRequest(
        accessToken,
        getConcertSeatsRes.body.data.seats[0].seatId,
      );
      expect(createReservationRes.body.statusCode).toBe(201);

      // 좌석 결제
      const createPaymentRes = await apiRequests.createPaymentRequest(
        accessToken,
        createReservationRes.body.data.id,
      );
      expect(createPaymentRes.body.statusCode).toBe(201);
    });

    it('유저가 돈이 없으면 결제가 실패해야 합니다. - /payment (POST)', async () => {
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
      expect(createConcertRes.body.statusCode).toBe(201);

      // 콘서트 날짜 생성
      const createConcertDateRes = await apiRequests.createConcertDateRequest(
        concertDate,
        createConcertRes.body.data.concertId,
        seatTotal,
        accessToken,
      );
      expect(createConcertDateRes.body.statusCode).toBe(201);

      // 콘서트 좌석 생성
      const createSeatRes = await apiRequests.createConcertDateSeatRequest(
        accessToken,
        createConcertDateRes.body.data.concertDateId,
        seatTotal,
        seatPrice,
      );
      expect(createSeatRes.body.statusCode).toBe(201);

      // 좌석 조회
      const getConcertSeatsRes = await apiRequests.getConcertSeatsRequest(
        createConcertDateRes.body.data.concertDateId,
        accessToken,
      );
      expect(getConcertSeatsRes.body.statusCode).toBe(200);

      // 좌석 예약
      const createReservationRes = await apiRequests.createReservationRequest(
        accessToken,
        getConcertSeatsRes.body.data.seats[0].seatId,
      );
      expect(createReservationRes.body.statusCode).toBe(201);

      // 좌석 결제
      const createPaymentRes = await apiRequests.createPaymentRequest(
        accessToken,
        createReservationRes.body.data.id,
      );
      expect(createPaymentRes.body.statusCode).toBe(400);
    });
  });

  afterAll(async () => {
    await prismaService.deleteTableData();
    await app.close();
  });
});
