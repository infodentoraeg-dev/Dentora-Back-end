import { PlanType } from "./../enums/PlanType";
import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema({

  name: { type: String, enum: Object.values(PlanType), default: PlanType.NO_PLAN, },

  price: Number,

  durationInMonths: Number,

  unitLimit: Number,

  features: [String],

  isActive: Boolean,
});

export default mongoose.model("Plan", PlanSchema);
