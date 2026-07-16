import mongoose from "mongoose";
import { SubscriptionStatus } from "../enums/SubscriptionStatus";
const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true,
  },
  startDate: Date,
  endDate: Date,
  remainingUnits: Number,
  status: {
    type: String,
    enum: Object.values(SubscriptionStatus),
    default: SubscriptionStatus.IDLE,
  },
  isActive: Boolean,
});

export default mongoose.model("Subscription", SubscriptionSchema);
