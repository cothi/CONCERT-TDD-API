import { Module } from "@nestjs/common";
import { PointController } from "./point.controller";
import { DatabaseModule } from "../database/database.module";
import { PointService } from "./point.service";
import { BullModule } from "@nestjs/bull";
import { PointProcessor } from "./point.processor";
import { UserPointTable } from "../database/userpoint.table";
import { PointHistoryTable } from "../database/pointhistory.table";

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({
      name: "point-queue",
    }),
  ],
  controllers: [PointController],
  providers: [PointService, PointProcessor, UserPointTable, PointHistoryTable],
})

export class PointModule {}
