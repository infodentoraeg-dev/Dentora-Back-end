import { Document, Types } from "mongoose";

export interface INotification extends Document {

  user: Types.ObjectId;

  title: string;

  message: string;

  type: string;

  isRead: boolean;

  link?: string;

  createdAt: Date;
  updatedAt: Date;
}