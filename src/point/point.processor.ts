import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

@Processor("point-queue")
export class PointProcessor {
  @Process("charge")
  async handleCharge(job: Job) {}

  @Process("use")
  async handleUse(job: Job) {}
}
