import Case from '../../../models/Case';

export const getCaseStatusChart = async () => {
  return await Case.aggregate([
    {
      $group: {
        _id: '$status',
        count: {
          $sum: 1,
        },
      },
    },
  ]);
};

export const getCasesPerMonth = async () => {
  return await Case.aggregate([
    {
      $group: {
        _id: {
          month: {
            $month: '$createdAt',
          },
        },
        total: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        '_id.month': 1,
      },
    },
  ]);
};
