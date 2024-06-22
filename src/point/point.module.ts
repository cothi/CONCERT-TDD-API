import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import {
  PointProcessorImpl,
  pointProcessorSymbol,
} from "./processor/point.processor.impl";
import {
  PointServiceImpl,
  pointServiceSymbol,
} from "./service/point.service.impl";
import { PointController } from "./controller/point.controller";
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
  providers: [
    {
      provide: pointServiceSymbol,
      useClass: PointServiceImpl,
    },
    {
      provide: pointProcessorSymbol,
      useClass: PointProcessorImpl,
    },
    UserPointTable,
    PointHistoryTable,
  ],
})
export class PointModule {}
