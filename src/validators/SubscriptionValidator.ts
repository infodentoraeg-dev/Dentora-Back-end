import { SubscriptionStatus } from '../enums/SubscriptionStatus';
import Subscription from '../models/Subscription';

export const checkSubscriptionUnits = async (userId: string) => {
  const subscription = await Subscription.findOne({
    userId,
    status: SubscriptionStatus.ACTIVE,
  });

  if (!subscription) {
    throw new Error('No active subscription');
  }

  if (!subscription.remainingUnits || subscription.remainingUnits <= 0) {
    throw new Error('No remaining units');
  }
  return subscription;
};
