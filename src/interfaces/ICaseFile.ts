import { Document, Types } from "mongoose";
import { FileType } from "../enums/FileType";
import { FileStage } from "../enums/FileStage";

export interface ICaseFile extends Document {

  case: Types.ObjectId;

  uploadedBy: Types.ObjectId;

  fileName: string;

  url: string;

  publicId?: string;

  fileSize: number;

  fileType: FileType;

  stage: FileStage;

  version: number;

  createdAt: Date;
  updatedAt: Date;
}