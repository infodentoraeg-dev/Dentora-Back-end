import { Document } from "mongoose";
import { PlanType } from "../enums/PlanType";

export interface IPlan extends Document {
  name: PlanType;

  price: number;

  durationInMonths: number;

  unitLimit: number;

  features: string[];

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}