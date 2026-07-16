import { Request, Response } from 'express';
import Subscription from '../models/Subscription';
import Plan from '../models/Plan';
import { SubscriptionStatus } from '../enums/SubscriptionStatus';
import User from '../models/User';
import { createNotification } from '../services/Notification';
import { NotificationType } from '../enums/NotificationType';
import Activity from '../models/Activity';
import { ActivityAction } from '../enums/ActivityAction';
import { ActivityActionRelatedTo } from '../enums/ActivityActionRelatedTo';
import { createActivity } from '../services/Activity';

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { planId } = req.body;
    const existingSubscription = await Subscription.findOne({
      userId,
      status: SubscriptionStatus.ACTIVE,
    });

    if (existingSubscription) {
      return res.status(400).json({
        message: 'You already have an active subscription',
      });
    }

    const plan = await Plan.findById(planId).select(
      'durationInMonths unitLimit',
    );
    if (!plan) {
      return res.status(404).json({
        message: 'Plan not found',
      });
    }
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + Number(plan.durationInMonths));
    const remainingUnits = Number(plan.unitLimit);
    const subscription = new Subscription({
      userId,
      planId,
      startDate,
      endDate,
      remainingUnits,
      status: SubscriptionStatus.ACTIVE,
    });
    await subscription.save();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    await createNotification({
      user: userId,
      title: 'Subscription Activated',
      message: 'Your subscription has been activated successfully.',
      type: NotificationType.SUBSCRIPTION_ACTIVATED,
      relatedId: subscription._id.toString(),
      relatedModel: 'Subscription',
    });
    await createActivity({
      relatedId: subscription._id.toString(),
      userId,
      action: ActivityAction.SUBSCRIPTION_CREATED,
      description: `Subscription created for user ${user.fullName}`,
      relatedModel: ActivityActionRelatedTo.SUBSCRIPTION,
    });
    res.json({
      message: 'Subscription created successfully',
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

export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await Subscription.find();
    res.json({
      message: 'Subscriptions retrieved successfully',
      total: subscriptions.length,
      subscriptions,
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

export const getSubscriptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({
        error: 'Subscription not found',
      });
    }
    res.json({
      message: 'Subscription retrieved successfully',
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

export const updateSubscriptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { planId } = req.body;
    const subscription = await Subscription.findByIdAndUpdate(
      id,
      {
        planId,
      },
      {
        new: true,
      },
    );
    if (!subscription) {
      return res.status(404).json({
        error: 'Subscription not found',
      });
    }
    res.json({
      message: 'Subscription updated successfully',
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

export const cancelSubscriptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByIdAndUpdate(
      id,
      {
        status: SubscriptionStatus.CANCELLED,
      },
      {
        new: true,
      },
    );
    if (!subscription) {
      return res.status(404).json({
        error: 'Subscription not found',
      });
    }
    res.json({
      message: 'Subscription cancelled successfully',
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
