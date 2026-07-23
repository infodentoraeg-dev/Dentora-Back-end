import { Request, Response } from 'express';
import Payment from '../models/Payment';
import Plan from '../models/Plan';
import { PaymentMethod } from '../enums/PaymentMethod';
import { PaymentStatus } from '../enums/PaymentStatus';
import Subscription from '../models/Subscription';
import { SubscriptionStatus } from '../enums/SubscriptionStatus';
import { createNotification } from '../services/Notification';
import { NotificationType } from '../enums/NotificationType';
import { ActivityAction } from '../enums/ActivityAction';
import { createActivity } from '../services/Activity';
import { ActivityActionRelatedTo } from '../enums/ActivityActionRelatedTo';
import mongoose from 'mongoose';

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { id: user } = req.user;

    const { planId, paymentMethod, screenshot } = req.body;

    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        message: 'Plan not found',
      });
    }

    let status = PaymentStatus.PENDING;

    if (
      paymentMethod === PaymentMethod.INSTAPAY ||
      paymentMethod === PaymentMethod.VODAFONE_CASH
    ) {
      status = PaymentStatus.UNDER_REVIEW;
    }

    const payment = await Payment.create({
      user,
      plan: plan._id,
      amount: plan.price,
      paymentMethod,
      screenshot,
      status,
    });
    await createNotification({
      user: payment.user.toString(),

      title: 'Payment Submitted',

      message: 'Your payment has been submitted successfully',

      type: NotificationType.PAYMENT_SUBMITTED,

      relatedId: payment._id.toString(),

      relatedModel: ActivityActionRelatedTo.PAYMENT,
    });

    await createActivity({
      userId: payment.user.toString(),

      action: ActivityAction.PAYMENT_APPROVED,

      description: 'Payment submitted to admin',

      relatedId: payment._id.toString(),

      relatedModel: ActivityActionRelatedTo.PAYMENT,
    });

    res.status(201).json({
      message: 'Payment created successfully',
      payment,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'fullName email')
      .populate('plan', 'name price');
    res.json({
      message: 'Payments retrieved successfully',
      total: payments.length,
      payments,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};

export const getMyPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find({ user: req.user.id }).select(
      '-reviewedBy -user -__v',
    ).populate(
      'plan',
      'name price',
    );

    res.json({
      message: 'Payments retrieved successfully',
      total: payments.length,
      payments,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};

export const approvePayment = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('plan');

    if (!payment) {
      return res.status(404).json({
        message: 'Payment not found',
      });
    }
    const plan = payment.plan as any;
    if (payment.status === PaymentStatus.APPROVED) {
      return res.status(400).json({
        message: 'Payment already approved',
      });
    }

    payment.status = PaymentStatus.APPROVED;
    payment.reviewedBy = new mongoose.Types.ObjectId(req.user.id);
    await payment.save();
    await createNotification({
      user: payment.user.toString(),

      title: 'Payment Approved',

      message: 'Your payment has been approved successfully',

      type: NotificationType.PAYMENT_APPROVED,

      relatedId: payment._id.toString(),

      relatedModel: ActivityActionRelatedTo.PAYMENT,
    });

    await createActivity({
      userId: payment.user.toString(),

      action: ActivityAction.PAYMENT_APPROVED,

      description: 'Payment approved by admin',

      relatedId: payment._id.toString(),

      relatedModel: ActivityActionRelatedTo.PAYMENT,
    });

    const startDate = new Date();

    const endDate = new Date(startDate);

    endDate.setMonth(endDate.getMonth() + plan.durationInMonths);

    const subscription = await Subscription.create({
      userId: payment.user,

      planId: payment.plan._id,

      startDate,

      endDate,

      remainingUnits: plan.unitLimit,

      status: SubscriptionStatus.ACTIVE,

      isActive: true,
    });

    await createNotification({
      user: payment.user.toString(),

      title: 'Subscription Activated',

      message: 'Your subscription has been activated successfully',

      type: NotificationType.SUBSCRIPTION_ACTIVATED,

      relatedId: subscription._id.toString(),

      relatedModel: ActivityActionRelatedTo.SUBSCRIPTION,
    });

    await createActivity({
      userId: payment.user.toString(),

      action: ActivityAction.SUBSCRIPTION_CREATED,

      description: 'Subscription created after payment approval',

      relatedId: subscription._id.toString(),

      relatedModel: ActivityActionRelatedTo.SUBSCRIPTION,
    });

    res.json({
      message: 'Subscription approved successfully',

      subscription,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};

export const rejectPayment = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        message: 'Payment not found',
      });
    }

    payment.status = PaymentStatus.REJECTED;

    payment.reviewedBy = new mongoose.Types.ObjectId(req.user.id);

    payment.reviewNote = req.body.note;

    await payment.save();

    await createNotification({
      user: payment.user.toString(),

      title: 'Payment Rejected',

      message: payment.reviewNote || 'Your payment was rejected',

      type: NotificationType.PAYMENT_REJECTED,

      relatedId: payment._id.toString(),

      relatedModel: ActivityActionRelatedTo.PAYMENT,
    });
    await createActivity({
      userId: payment.user.toString(),

      action: ActivityAction.PAYMENT_REJECTED,

      description: 'Payment rejected by admin',

      relatedId: payment._id.toString(),

      relatedModel: ActivityActionRelatedTo.PAYMENT,
    });
    res.json({
      message: 'Payment rejected',
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};
