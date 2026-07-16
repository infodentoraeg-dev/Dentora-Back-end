import { CaseStatus } from '../../../enums/CaseStatus';
import { PaymentStatus } from '../../../enums/PaymentStatus';
import Case from '../../../models/Case';

class Cases {
  async getCases(doctorId: string) {
    const [
      totalCases,
      completedCases,
      pendingCases,
      inProgressCases,
      waitingPaymentCases,
      latestCases,
    ] = await Promise.all([
      Case.countDocuments({ doctor: doctorId }),

      Case.countDocuments({
        doctor: doctorId,
        status: CaseStatus.COMPLETED,
      }),

      Case.countDocuments({
        doctor: doctorId,
        status: CaseStatus.PENDING,
      }),

      Case.countDocuments({
        doctor: doctorId,
        status: CaseStatus.IN_PROGRESS,
      }),

      Case.countDocuments({
        doctor: doctorId,
        paymentStatus: PaymentStatus.PENDING,
      }),

      Case.find({ doctor: doctorId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          '_id patientName status paymentStatus caseType createdAt expectedDeliveryDate',
        ),
    ]);

    return {
      totalCases,
      completedCases,
      pendingCases,
      inProgressCases,
      waitingPaymentCases,
      latestCases,
    };
  }
}

export default new Cases();
