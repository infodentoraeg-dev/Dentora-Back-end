import { CaseStatus } from '../enums/CaseStatus';

const allowedTransitions = {
  DRAFT: [CaseStatus.PENDING],

  PENDING: [CaseStatus.ASSIGNED, CaseStatus.CANCELLED],

  ASSIGNED: [CaseStatus.IN_PROGRESS, CaseStatus.CANCELLED],

  IN_PROGRESS: [CaseStatus.REVISION_REQUIRED, CaseStatus.WAITING_PAYMENT],

  REVISION_REQUIRED: [CaseStatus.IN_PROGRESS],

  WAITING_PAYMENT: [CaseStatus.PAYMENT_APPROVED, CaseStatus.CANCELLED],

  PAYMENT_APPROVED: [CaseStatus.DELIVERED],

  DELIVERED: [CaseStatus.COMPLETED],
};

export const canChangeCaseStatus = (oldStatus: string, newStatus: string) => {
  const allowed =
    allowedTransitions[oldStatus as keyof typeof allowedTransitions];

  return allowed?.includes(newStatus as CaseStatus) ?? false;
};
