import { Request, Response } from 'express';
import Case from '../../models/Case';
import Subscription from '../../models/Subscription';
import { SubscriptionStatus } from '../../enums/SubscriptionStatus';
import { CaseStatus } from '../../enums/CaseStatus';

export const dashboard = async (req: Request, res: Response) => {
  try {
    const doctorId = req.user.id;
    const [
      totalCases,
      pendingCases,
      completedCases,
      recentCases,
      subscription,
    ] = await Promise.all([
      Case.countDocuments({ doctor: doctorId }),
      Case.countDocuments({ doctor: doctorId, status: CaseStatus.PENDING }),
      Case.countDocuments({ doctor: doctorId, status: CaseStatus.COMPLETED }),
      Case.find({ doctor: doctorId }).sort({ createdAt: -1 }).limit(5),
      Subscription.findOne({
        userId: doctorId,
        status: SubscriptionStatus.ACTIVE,
      }).populate('planId', 'name'),
    ]);

    res.json({
      doctor: {
        fullName: req.user.fullName,
      },

      statistics: {
        totalCases,
        pendingCases,
        completedCases,
      },

      subscription: {
        remainingUnits: subscription?.remainingUnits ?? null,
        expiresAt: subscription?.endDate ?? null,
        plan: subscription?.planId ?? null,
      },

      recentCases,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server Error',
    });
  }
};
