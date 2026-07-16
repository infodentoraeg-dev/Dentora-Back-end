import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  password: String,
  role: String,

  otpVerified: {
    type: Boolean,
    default: false
  },

  expiresAt: Date
});
export default mongoose.model('PendingUser', pendingUserSchema);
