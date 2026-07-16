import { Document, Types } from "mongoose";
import { AssignmentStatus } from "../enums/AssignmentStatus";

export interface IAssignment extends Document {

  case: Types.ObjectId;

  assignedBy: Types.ObjectId;

  assignedTo: Types.ObjectId;

  status: AssignmentStatus;

  assignedAt: Date;

  acceptedAt?: Date;

  submittedAt?: Date;

  adminNotes?: string;

  assistantNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}