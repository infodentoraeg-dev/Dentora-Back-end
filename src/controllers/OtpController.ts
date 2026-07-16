import { Request, Response } from 'express';
import { createAndSaveOtp } from '../services/otp';

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    await createAndSaveOtp(email);

    res.json({
      message: 'OTP sent',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
    });
  }
};
