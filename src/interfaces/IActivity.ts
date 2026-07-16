import { Document, Types } from "mongoose";

export interface IActivity extends Document {

  case: Types.ObjectId;

  user: Types.ObjectId;

  action: string;

  description: string;

  createdAt: Date;
  updatedAt: Date;
}