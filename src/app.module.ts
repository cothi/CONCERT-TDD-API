import { Module } from "@nestjs/common";
import { PointModule } from "./point/point.module";
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    PointModule,
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6380,
      },
    }),
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
