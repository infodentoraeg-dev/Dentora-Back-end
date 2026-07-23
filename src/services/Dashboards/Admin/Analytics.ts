import Case from '../../../models/Case';

export const getTopDoctors = async () => {
  return await Case.aggregate([
    {
      $group: {
        _id: '$doctor',
        totalCases: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        totalCases: -1,
      },
    },

    {
      $limit: 5,
    },

    {
      $lookup: {
        from: 'doctors',
        localField: '_id',
        foreignField: '_id',
        as: 'doctor',
      },
    },

    {
      $unwind: '$doctor',
    },

    {
      $project: {
        _id: 0,
        doctor: {
          _id: '$doctor._id',
          name: '$doctor.fullName',
          email: '$doctor.email',
        },
        totalCases: '$totalCases',
      },
    },
  ]);
};
