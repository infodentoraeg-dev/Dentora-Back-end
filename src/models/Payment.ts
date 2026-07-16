import { PaymentStatus } from './../enums/PaymentStatus';
import { PaymentMethod } from './../enums/PaymentMethod';
import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
    },
    amount: Number,

    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.INSTAPAY,
    },

    screenshot: String,

    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewNote: String,
  },
  {
    timestamps: true,
  },
);
export default mongoose.model('Payment', PaymentSchema);
