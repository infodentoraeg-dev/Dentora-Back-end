import subscriptionService from './Subscriptions';
import caseService from './Cases';
import Plan from '../../../models/Plan';
import { Request } from 'express';

export const getDashboard = async (doctorId:string) => {
  const [subscription, cases] = await Promise.all([
    subscriptionService.getSubscription(doctorId),
    caseService.getCases(doctorId),
  ]);

  const plan = await Plan.findById(subscription.currentPlan).select(
    'unitLimit',
  );
  const totalUnits = plan?.unitLimit ?? 0;

  return {
    ...subscription,
    ...cases,

    monthlyUsage: {
      used: totalUnits - Number(subscription.remainingUnits),
      remaining: subscription.remainingUnits ?? 0,
      total: totalUnits,
    },
  };
};
