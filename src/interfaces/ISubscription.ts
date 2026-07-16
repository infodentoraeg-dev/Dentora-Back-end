import { Document, Types } from "mongoose";
import { SubscriptionStatus } from "../enums/SubscriptionStatus";

export interface ISubscription extends Document {
  userId: Types.ObjectId;

  planId: Types.ObjectId;

  startDate: Date;

  endDate: Date;

  remainingUnits: number;

  status: SubscriptionStatus;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}
