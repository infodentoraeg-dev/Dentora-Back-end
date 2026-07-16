import mongoose from 'mongoose';
import { UserRole } from '../enums/UserRole';
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },

    phone: { type: String, required: [true, 'Phone number is required'] },

    password: { type: String, required: [true, 'Password is required'] },

    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: 'Clinic',
    },

    profileImage: String,

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.DOCTOR,
    },

    isActive: Boolean,

    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model('User', UserSchema);
