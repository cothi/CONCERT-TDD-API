import { Job } from "bull";
import { UserPoint } from "../point.model";

export interface PointProcessor  {
  handleCharge(job: Job): Promise<UserPoint>;
  handleUse(job: Job): Promise<UserPoint>;
}