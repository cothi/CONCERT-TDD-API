import { Injectable } from '@nestjs/common';
import { Prisma, Reservation } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';

@Injectable()
export class ReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.ReservationCreateInput,
    tx?: PrismaTransaction,
  ): Promise<Reservation> {
    return (tx ?? this.prisma).reservation.create({
      data,
    });
  }
}

// expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
