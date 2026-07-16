import { Request, Response, NextFunction } from 'express';
import { PaymentMethod } from '../enums/PaymentMethod';

export const validatePayment = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { amount, paymentMethod } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      message: 'Invalid payment amount',
    });
  }

  if (!Object.values(PaymentMethod).includes(paymentMethod)) {
    return res.status(400).json({
      message: 'Invalid payment method',
    });
  }

  next();
};
