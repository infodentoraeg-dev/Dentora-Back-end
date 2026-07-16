import { PaymentStatus } from '../../../enums/PaymentStatus';
import User from '../../../models/User';
import Case from '../../../models/Case';
import Payment from '../../../models/Payment';
import { CaseStatus } from '../../../enums/CaseStatus';
import { UserRole } from '../../../enums/UserRole';

export const getStatistics = async () => {
  const [
    totalDoctors,
    totalAssistants,
    totalCases,
    completedCases,
    cancelledCases,
    waitingPayments,
    approvedPayments,
  ] = await Promise.all([
    User.countDocuments({
      role: UserRole.DOCTOR,
    }),

    User.countDocuments({
      role: UserRole.ASSISTANT,
    }),

    Case.countDocuments(),

    Case.countDocuments({
      status: CaseStatus.COMPLETED,
    }),

    Case.countDocuments({
      status: CaseStatus.CANCELLED,
    }),

    Payment.countDocuments({
      status: PaymentStatus.PENDING,
    }),

    Payment.countDocuments({
      status: PaymentStatus.APPROVED,
    }),
  ]);

  return {
    totalDoctors,
    totalAssistants,
    totalCases,
    completedCases,
    cancelledCases,
    waitingPayments,
    approvedPayments,
  };
};
