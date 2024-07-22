import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      transactionOptions: {
        timeout: 300000,
        maxWait: 300000,
      },
    });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async deleteTableData() {
    await this.reservation.deleteMany();
    await this.user.deleteMany();
    await this.seat.deleteMany();
    await this.concert.deleteMany();

    await this.queueEntry.deleteMany();
    await this.payment.deleteMany();
    await this.transaction.deleteMany();
    await this.userPoint.deleteMany();
    await this.concertDate.deleteMany();
  }
}
