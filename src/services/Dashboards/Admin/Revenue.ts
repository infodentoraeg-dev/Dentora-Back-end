import { PaymentStatus } from "../../../enums/PaymentStatus";
import Payment from "../../../models/Payment";

export const getRevenue = async () => {
  const revenue = await Payment.aggregate([
    {
      $match: {
        status: PaymentStatus.APPROVED,
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return {
    totalRevenue: revenue[0]?.totalRevenue || 0,
  };
};