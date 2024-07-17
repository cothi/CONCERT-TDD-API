// src/test/helpers/api-requests.ts

import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export const createApiRequests = (app: INestApplication) => ({
  loginRequest: (email: string) =>
    request(app.getHttpServer()).post('/auth/login').send({ email }),

  createUserRequest: (email: string = `user${Date.now()}@example.com`) =>
    request(app.getHttpServer()).post('/auth/register').send({ email }),

  createEnqueueRequest: (accessToken: string) =>
    request(app.getHttpServer())
      .post('/enqueue')
      .set('Authorization', `Bearer ${accessToken}`),

  chargePointRequest: (accessToken: string, amount: number) =>
    request(app.getHttpServer())
      .patch('/points/charge')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ amount }),

  createConcertRequest: (accessToken: string, name: string) =>
    request(app.getHttpServer())
      .post('/concerts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name }),

  createConcertDateRequest: (
    date: Date,
    concertId: string,
    totalSeat: number,
    accessToken: string,
  ) =>
    request(app.getHttpServer())
      .post(`/concerts/${concertId}/dates`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ date, totalSeat }),

  createConcertDateSeatRequest: (
    accessToken: string,
    concertDateId: string,
    seatNumber: number,
    price: number,
  ) =>
    request(app.getHttpServer())
      .post(`/concerts/dates/${concertDateId}/seats`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ seatNumber, price }),

  getConcertSeatsRequest: (concertDateId: string, accessToken: string) =>
    request(app.getHttpServer())
      .get(`/concerts/dates/${concertDateId}/seats`)
      .set('Authorization', `Bearer ${accessToken}`),

  createReservationRequest: (accessToken: string, seatId: string) =>
    request(app.getHttpServer())
      .post('/concerts/seats/reserve')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ seatId }),

  createPaymentRequest: (accessToken: string, reservationId: string) =>
    request(app.getHttpServer())
      .post('/payment')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ reservationId }),
  getQueueStatusRequest: (accessToken: string) =>
    request(app.getHttpServer())
      .get(`/enqueue`)
      .set('Authorization', `Bearer ${accessToken}`),
});
