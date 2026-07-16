import Case from '../../../models/Case';
import { CaseStatus } from '../../../enums/CaseStatus';

export const getLatestCases = async () => {
  return await Case.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('doctor', 'name')
    .select('_id patientName caseType status createdAt doctor');
};

export const getTopCaseTypes = async () => {
  return await Case.aggregate([
    {
      $group: {
        _id: '$caseType',
        total: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        total: -1,
      },
    },
    {
      $limit: 5,
    },
  ]);
};

export const getDeliveryPerformance = async () => {
  const [completedCases, delayedCases] = await Promise.all([
    Case.countDocuments({
      status: CaseStatus.COMPLETED,
    }),

    Case.countDocuments({
      status: CaseStatus.PENDING,
    }),
  ]);

  return {
    completedCases,
    delayedCases,
  };
};
