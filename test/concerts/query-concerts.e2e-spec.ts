import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { AppModule } from 'src/modules/app.module';
import { createApiRequests } from '../helpers/api-requests';
import { RedisService } from 'src/infrastructure/database/redis/redis.service';

describe('콘서트', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let redisService: RedisService;
  let apiRequest: ReturnType<typeof createApiRequests>;
  const seatTotal = 100;
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
    redisService = app.get<RedisService>(RedisService);
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

    redisService.grantReservationPermissions([testUser.id]);

    testContext.accessToken = loginResponse.body.data.accessToken;
  });

  describe('콘서트 날짜 좌석 조회 - /concerts/dates/:concertDateId/seats (GET)', () => {
    it('콘서트 날짜 좌석 조회가 정상적으로 이루어져야 합니다.', async () => {
      const concertName = 'test concert13';
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );
      expect(concertResponse.body.statusCode).toBe(201);

      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        concertResponse.body.data.concertId,
        seatTotal,
        testContext.accessToken,
      );
      expect(concertDateResponse.body.statusCode).toBe(201);
      const concertDateSeatResponse =
        await apiRequest.createConcertDateSeatRequest(
          testContext.accessToken,
          concertDateResponse.body.data.concertDateId,
          1,
          1,
        );

      expect(concertDateSeatResponse.body.statusCode).toBe(201);

      const getConcertDateSeatResponse =
        await apiRequest.getConcertSeatsRequest(
          concertDateResponse.body.data.concertDateId,
          testContext.accessToken,
        );
      expect(getConcertDateSeatResponse.body.statusCode).toBe(200);
    });

    it('콘서트 날짜 좌석 조회 시 콘서트 날짜 아이디가 없으면 에러가 발생해야 합니다.', async () => {
      const concertDateSeatResponse = await apiRequest.getConcertSeatsRequest(
        '1',
        testContext.accessToken,
      );
      expect(concertDateSeatResponse.body.statusCode).toBe(404);
    });

    it('콘서트 날짜 좌석 조회 시 토큰이 없으면 에러가 발생해야 합니다.', async () => {
      const concertName = 'test concert14';
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );
      expect(concertResponse.body.statusCode).toBe(201);

      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        concertResponse.body.data.concertId,
        seatTotal,
        testContext.accessToken,
      );
      expect(concertDateResponse.body.statusCode).toBe(201);

      const concertDateSeatResponse = await apiRequest.getConcertSeatsRequest(
        concertDateResponse.body.data.concertDateId,
        '',
      );
      expect(concertDateSeatResponse.body.statusCode).toBe(401);
    });

    it('콘서트 날짜 좌석 조회 시 콘서트 날짜가 없으면 에러가 발생해야 합니다.', async () => {
      const concertDateSeatResponse = await apiRequest.getConcertSeatsRequest(
        randomUUID(),
        testContext.accessToken,
      );
      expect(concertDateSeatResponse.body.statusCode).toBe(404);
    });
  });

  describe('콘서트 예약 조회 - /concerts/seats/reserve (GET)', () => {
    it('콘서트 예약 조회가 정상적으로 이루어져야 합니다.', async () => {
      const concertName = 'test concert15';
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );
      expect(concertResponse.body.statusCode).toBe(201);

      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        concertResponse.body.data.concertId,
        seatTotal,
        testContext.accessToken,
      );
      expect(concertDateResponse.body.statusCode).toBe(201);

      const concertDateSeatResponse =
        await apiRequest.createConcertDateSeatRequest(
          testContext.accessToken,
          concertDateResponse.body.data.concertDateId,
          1,
          1,
        );
      expect(concertDateSeatResponse.body.statusCode).toBe(201);

      const getSeatsResponse = await apiRequest.getConcertSeatsRequest(
        concertDateResponse.body.data.concertDateId,
        testContext.accessToken,
      );
      const seatId = getSeatsResponse.body.data.seats[0].seatId;
      const reserveSeatResponse = await apiRequest.reserveSeatRequest(
        testContext.accessToken,
        seatId,
      );
      expect(reserveSeatResponse.body.statusCode).toBe(201);

      const getReservationResponse = await apiRequest.getReservationRequest(
        testContext.accessToken,
      );
      expect(getReservationResponse.body.statusCode).toBe(200);
    });
    it('콘서트 예약 조회 시 토큰이 없으면 에러가 발생해야 합니다.', async () => {
      const getReservationResponse = await apiRequest.getReservationRequest('');
      expect(getReservationResponse.body.statusCode).toBe(401);
    });
  });

  afterAll(async () => {
    await app.close();
    await prismaService.deleteTableData();
  });
});
