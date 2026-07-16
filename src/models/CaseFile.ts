import { FileStage } from './../enums/FileStage';
import { FileType } from './../enums/FileType';
import mongoose from 'mongoose';

const CaseFileSchema = new mongoose.Schema(
  {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    fileName: String,

    url: String,

    publicId: String,

    fileSize: Number,

    fileType: {
      type: String,
      enum: Object.values(FileType),
      default: FileType.STL,
    },

    stage: {
      type: String,
      enum: Object.values(FileStage),
      default: FileStage.DOCTOR_UPLOAD,
    },

    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('CaseFile', CaseFileSchema);
