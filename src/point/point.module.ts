import { Module } from "@nestjs/common";
import { PointController } from "./point.controller";
import { DatabaseModule } from "../database/database.module";
import { PointService } from "./point.service";
import { BullModule } from "@nestjs/bull";
import { PointProcessor } from "./point.processor";

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({
      name: "point-queue",
    }),
  ],
  controllers: [PointController],
  providers: [PointService, PointProcessor],
})
export class PointModule {}
