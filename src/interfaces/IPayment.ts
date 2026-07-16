import { Document, Types } from "mongoose";
import { PaymentMethod } from "../enums/PaymentMethod";
import { PaymentStatus } from "../enums/PaymentStatus";

export interface IPayment extends Document {
  doctor: Types.ObjectId;

  case: Types.ObjectId;

  amount: number;

  paymentMethod: PaymentMethod;

  screenshot?: string;

  status: PaymentStatus;

  reviewedBy?: Types.ObjectId;

  reviewNote?: string;

  createdAt: Date;
  updatedAt: Date;
}