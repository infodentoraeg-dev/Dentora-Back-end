import { Document } from "mongoose";
import { UserRole } from "../enums/UserRole";

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  password: string;

  profileImage?: string;

  role: UserRole;

  isActive: boolean;
  isVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}
