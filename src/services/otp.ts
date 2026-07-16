import bcrypt from 'bcrypt';
import Otp from '../models/Otp';
import { sendEmailOtp } from './Email';

export const createAndSaveOtp = async (email: string) => {
  await Otp.deleteMany({ email });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOtp = await bcrypt.hash(otp, 10);

  await Otp.create({
    email,
    code: hashedOtp,
    attempts: 0,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  //   await sendWhatsappMessage(phone, otp);
  await sendEmailOtp(email, otp);
  return true;
};

export const verifyOtp = async (email: string, otp: string) => {
  const otpDoc = await Otp.findOne({ email });

  if (!otpDoc) {
    throw new Error('OTP not found');
  }

  if (otpDoc.expiresAt < new Date()) {
    await otpDoc.deleteOne();
    throw new Error('OTP expired');
  }
  if (otpDoc.attempts >= 3) {
    await otpDoc.deleteOne();

    throw new Error('Too many attempts, please request a new OTP');
  }

  const isValid = await bcrypt.compare(otp, otpDoc.code);

  if (!isValid) {
    otpDoc.attempts++;
    await otpDoc.save();

    throw new Error(`Invalid OTP. Attempts left: ${3 - otpDoc.attempts}`);
  }

  await otpDoc.deleteOne();

  return true;
};
