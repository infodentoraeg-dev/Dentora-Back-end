import Subscription from "../../../models/Subscription";

class Subscriptions {
  async getSubscription(doctorId: string) {
    const subscription = await Subscription.findOne({ doctor: doctorId });

    if (!subscription) {
      return {
        currentPlan: null,
        remainingUnits: 0,
        subscriptionExpireDate: null,
        vipStatus: false,
        vipBadge: null,
      };
    }

    return {
      currentPlan: subscription.planId,
      remainingUnits: subscription.remainingUnits,
      subscriptionExpireDate: subscription.endDate,
      Status: subscription.status,
    };
  }
}

export default new Subscriptions();