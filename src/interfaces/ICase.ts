import { Document, Types } from "mongoose";
import { CaseType } from "../enums/CaseType";
import { CaseStatus } from "../enums/CaseStatus";
import { Priority } from "../enums/Priority";
import { AssignmentType } from "../enums/AssignmentType";
import { PaymentStatus } from "../enums/PaymentStatus";

export interface ICase extends Document {

  caseNumber: string;

  doctor: Types.ObjectId;

  title: string;

  description?: string;

  caseType: CaseType;

  priority: Priority;

  status: CaseStatus;

  assignedTo?: Types.ObjectId;

  assignmentType: AssignmentType;

  paymentStatus: PaymentStatus;

  price: number;

  estimatedDelivery?: Date;

  completedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}