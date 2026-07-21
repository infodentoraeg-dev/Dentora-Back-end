import Case from '../models/Case';
import { Request, Response } from 'express';
import { createNotification } from '../services/Notification';
import { NotificationType } from '../enums/NotificationType';
import User from '../models/User';
import { UserRole } from '../enums/UserRole';
import { ActivityAction } from '../enums/ActivityAction';
import { createActivity } from '../services/Activity';
import { CaseStatus } from '../enums/CaseStatus';
import { ActivityActionRelatedTo } from '../enums/ActivityActionRelatedTo';
import { canChangeCaseStatus } from '../validators/CaseStatusValidator';
import { checkSubscriptionUnits } from '../validators/SubscriptionValidator';
import catchAsync from '../middleware/CatchAsync';
import { createCaseWithConfiguration } from '../services/Dashboards/Doctor/CreateCase';

// export const createCase = async (req: Request, res: Response) => {
//   try {
//     const caseData = { ...req.body };
//     caseData.doctor = req.user.id;
//     // let caseNumber = await Case.countDocuments({}) + 1;
//     const caseExist = await Case.findOne({ caseNumber: req.body.caseNumber });
//     if (caseExist)
//       return res
//         .status(400)
//         .json({ message: 'Case already exists with the same case number' });
//     const subscription = await checkSubscriptionUnits(req.user.id);
//     if (subscription && subscription.remainingUnits) {
//       subscription.remainingUnits--;
//       await subscription.save();
//     }
//     const createdCase = await Case.create(caseData);
//     const admin = await User.findOne({
//       role: UserRole.ADMIN,
//     });
//     if (!admin) {
//       return res.status(500).json({
//         message: 'Admin account not found',
//       });
//     }
//     await createActivity({
//       relatedId: createdCase._id.toString(),
//       userId: req.user.id,
//       action: ActivityAction.CASE_CREATED,
//       description: `${req.user.fullName} created the case`,
//       relatedModel: ActivityActionRelatedTo.CASE,
//     });

//     await createNotification({
//       user: admin._id.toString(),
//       title: 'New Case Assigned',
//       message: 'A new case has been assigned to you',
//       type: NotificationType.CASE_ASSIGNED,
//       relatedId: createdCase._id.toString(),
//       relatedModel: 'Case',
//     });

//     res.status(201).json({
//       message: 'Case created successfully',
//       case: await createdCase.populate('doctor', 'fullName -_id'),
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({
//         error: error.message,
//       });
//     } else {
//       res.status(500).json({
//         error: 'Unknown error',
//       });
//     }
//   }
// };

export const createCase = catchAsync(async (req: Request, res: Response) => {
  const body = {
    ...req.body,
    doctor: req.user.id,
  };

  const createdCase = await createCaseWithConfiguration(
    body,
    (req.files as Express.Multer.File[]) || [],
    req.user,
  );

  res.status(201).json({
    message: 'Case created successfully',
    case: createdCase,
  });
});

export const getAllCases = async (req: Request, res: Response) => {
  try {
    const filter: any = {};

    if (req.query.type) {
      filter.caseType = String(req.query.type).toUpperCase();
    }

    if (req.query.priority) {
      filter.priority = String(req.query.priority).toUpperCase();
    }

    if (req.query.status) {
      filter.status = String(req.query.status).toUpperCase();
    }

    if (req.query.price) {
      filter.price = Number(req.query.price);
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};

      if (req.query.minPrice) {
        filter.price.$gte = Number(req.query.minPrice);
      }

      if (req.query.maxPrice) {
        filter.price.$lte = Number(req.query.maxPrice);
      }
    }
    const cases = await Case.find(filter).populate('doctor', 'fullName -_id');
    res.status(200).json({
      success: true,
      total: cases.length,
      cases,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};

export const getCaseById = async (req: Request, res: Response) => {
  try {
    const caseId = req.params.id;
    const caseExist = await Case.findById(caseId);
    if (!caseExist) return res.status(404).json({ message: 'Case not found' });
    res.status(200).json({
      case: await caseExist.populate('doctor', 'fullName -_id'),
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};

export const updateCaseById = async (req: Request, res: Response) => {
  try {
    const caseId = req.params.id;
    const caseExist = await Case.findById(caseId);
    if (!caseExist) return res.status(404).json({ message: 'Case not found' });
    const oldStatus = caseExist.status;
    // const oldAssignedTo = caseExist.assignedTo;
    if (
      req.body.status &&
      !canChangeCaseStatus(caseExist.status, req.body.status)
    ) {
      return res.status(400).json({
        message: 'Invalid status transition',
      });
    }
    const updateCase = await Case.findByIdAndUpdate(caseId, req.body, {
      new: true,
    });
    if (!updateCase) return res.status(404).json({ message: 'Case not found' });
    // if (
    //   req.body.assignedTo &&
    //   oldAssignedTo?.toString() !== updateCase.assignedTo?.toString()
    // ) {
    //   await createNotification({
    //     user: updateCase.assignedTo!.toString(),

    //     title: 'New Case Assigned',

    //     message: `A new case "${updateCase.title}" has been assigned to you`,

    //     type: NotificationType.CASE_ASSIGNED,

    //     link: `/cases/${updateCase._id}`,

    //     relatedId: updateCase._id.toString(),

    //     relatedModel: 'Case',
    //   });
    // }
    if (oldStatus !== updateCase.status && updateCase.status === 'COMPLETED') {
      await createNotification({
        user: updateCase.doctor.toString(),
        title: 'Case Completed',
        message: `Your case "${updateCase.title}" has been completed`,
        type: NotificationType.CASE_COMPLETED,
        link: `/cases/${updateCase._id}`,
        relatedId: updateCase._id.toString(),
        relatedModel: 'Case',
      });
    }
    res.status(200).json({
      case: await updateCase.populate('doctor', 'fullName -_id'),
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};

export const deleteCaseById = async (req: Request, res: Response) => {
  try {
    const caseId = req.params.id;
    const deletedCase = await Case.findByIdAndDelete(caseId);
    if (!deletedCase)
      return res.status(404).json({ message: 'Case not found' });
    res.status(200).json({
      message: 'Case deleted successfully',
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};

export const getCasesByDoctorId = async (req: Request, res: Response) => {
  try {
    const cases = await Case.find({ doctor: req.params.id }).populate(
      'doctor',
      'fullName -_id',
    );
    res.status(200).json({
      success: true,
      total: cases.length,
      cases,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};

export const getMyCases = async (req: Request, res: Response) => {
  try {
    const cases = await Case.find({ doctor: req.user.id });
    res.status(200).json({
      success: true,
      total: cases.length,
      cases: cases.map((caseItem) => ({
        id: caseItem._id,
        caseNumber: caseItem.caseNumber,
        caseType: caseItem.caseType,
        createdAt: caseItem.createdAt,
        estimatedDelivery: caseItem.estimatedDelivery,
        paymentStatus: caseItem.paymentStatus,
        price: caseItem.price,
        status: caseItem.status,
        title: caseItem.title,
        description: caseItem.description,
        patientName: caseItem.patientName,
        patientType: caseItem.patientType,
        patientAge: caseItem.patientAge,
      })),
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};

export const getMyPatients = async (req: Request, res: Response) => {
  try {
    const patients = await Case.find({ doctor: req.user.id });
    res.status(200).json({
      success: true,
      total: patients.length,
      patients: patients.map((caseItem) => ({
        id: caseItem._id,
        caseType: caseItem.caseType,
        price: caseItem.price,
        title: caseItem.title,
        patientName: caseItem.patientName,
        patientType: caseItem.patientType,
        patientAge: caseItem.patientAge,
      })),
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};

export const completeCaseById = async (req: Request, res: Response) => {
  try {
    const caseId = req.params.id;

    const caseExist = await Case.findById(caseId);

    if (!caseExist) {
      return res.status(404).json({
        message: 'Case not found',
      });
    }

    if (caseExist.status === 'COMPLETED') {
      return res.status(400).json({
        message: 'Case already completed',
      });
    }

    // Update case status
    caseExist.status = CaseStatus.COMPLETED;
    caseExist.completedAt = new Date();
    await caseExist.save();

    // Activity
    await createActivity({
      relatedId: caseExist._id.toString(),
      userId: req.user.id,
      action: ActivityAction.CASE_COMPLETED,
      description: `${req.user.fullName} completed the case`,
      relatedModel: ActivityActionRelatedTo.CASE,
    });

    // Notification to doctor
    await createNotification({
      user: caseExist.doctor.toString(),
      title: 'Case Completed',
      message: `Your case "${caseExist.title}" has been completed`,
      type: NotificationType.CASE_COMPLETED,
      link: `/cases/${caseExist._id}`,
      relatedId: caseExist._id.toString(),
      relatedModel: 'Case',
    });

    res.status(200).json({
      message: 'Case completed successfully',
      case: caseExist,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};

export const cancelCaseById = async (req: Request, res: Response) => {
  try {
    const caseId = req.params.id;

    const caseExist = await Case.findById(caseId);

    if (!caseExist) {
      return res.status(404).json({
        message: 'Case not found',
      });
    }

    if (caseExist.status === CaseStatus.CANCELLED) {
      return res.status(400).json({
        message: 'Case already cancelled',
      });
    }

    // Update case status
    caseExist.status = CaseStatus.CANCELLED;

    await caseExist.save();

    // Activity
    await createActivity({
      relatedId: caseExist._id.toString(),
      userId: req.user.id,
      action: ActivityAction.CASE_CANCELLED,
      description: `${req.user.fullName} cancelled the case`,
      relatedModel: ActivityActionRelatedTo.CASE,
    });

    // Notification to doctor
    await createNotification({
      user: caseExist.doctor.toString(),
      title: 'Case Cancelled',
      message: `Your case "${caseExist.title}" has been cancelled`,
      type: NotificationType.CASE_CANCELLED,
      link: `/cases/${caseExist._id}`,
      relatedId: caseExist._id.toString(),
      relatedModel: 'Case',
    });

    res.status(200).json({
      message: 'Case cancelled successfully',
      case: caseExist,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Unknown error',
      });
    }
  }
};
