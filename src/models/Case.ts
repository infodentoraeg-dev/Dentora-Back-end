import { Priority } from './../enums/Priority';
import mongoose from 'mongoose';
import { PaymentStatus } from '../enums/PaymentStatus';
import { AssignmentType } from '../enums/AssignmentType';
import { CaseStatus } from '../enums/CaseStatus';
import { CaseType } from '../enums/CaseType';

const CaseSchema = new mongoose.Schema(
  {
    caseNumber: { type: String, unique: true },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Doctor is required'],
    },

    title: { type: String, required: [true, 'Title is required'], minLength: 3, maxLength: 100 },

    description: { type: String, required: [true, 'Description is required'], minLength: 10, maxLength: 1000 },

    caseType: {
      type: String,
      enum: Object.values(CaseType),
      default: CaseType.CROWN,
    },

    priority: {
      type: String,
      enum: Object.values(Priority),
      default: Priority.MEDIUM,
    },

    status: {
      type: String,
      enum: Object.values(CaseStatus),
      default: CaseStatus.PENDING,
    },

    assignmentType: {
      type: String,
      enum: Object.values(AssignmentType),
      default: AssignmentType.SELF,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },

    price: Number,

    estimatedDelivery: Date,

    completedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model('Case', CaseSchema);
