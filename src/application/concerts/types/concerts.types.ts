import { Prisma, ReservationStatus } from '@prisma/client';

// 기본 엔티티 타입들
type Seat = {
  seatNumber: number;
  price: Prisma.Decimal;
};

type ConcertDate = {
  date: Date;
};

type Concert = {
  name: string;
};

// Prisma의 Reservation 타입을 확장
type ReservationBase = {
  id: string;
  userId: string;
  seatId: string;
  concertId: string;
  concertDateId: string;
  status: ReservationStatus;
  createdAt: Date;
  expiresAt: Date;
  updatedAt: Date;
};

// 최종 Reservation 타입
export type ReservationWithRelations = ReservationBase & {
  seat: Seat;
  concertDate: ConcertDate;
  concert: Concert;
};

// 배열 타입
export type ReservationList = ReservationWithRelations[];
