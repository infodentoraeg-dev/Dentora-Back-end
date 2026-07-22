import mongoose from 'mongoose';

import Case from '../../../models/Case';
import User from '../../../models/User';

import { UserRole } from '../../../enums/UserRole';
import { ActivityAction } from '../../../enums/ActivityAction';
import { ActivityActionRelatedTo } from '../../../enums/ActivityActionRelatedTo';
import { NotificationType } from '../../../enums/NotificationType';

import { createActivity } from '../../Activity';
import { createNotification } from '../../Notification';

import { checkSubscriptionUnits } from '../../../validators/SubscriptionValidator';

import AppError from '../../../utils/AppError';

import { createCaseConfiguration } from './createConfiguration';
import { uploadCaseFiles } from './uploadCaseFiles';

export const createCaseWithConfiguration = async (
  body: any,
  files: Express.Multer.File[],
  user: any,
) => {
  console.log('Controller reached');
  console.log(body);
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const exists = await Case.findOne({
      caseNumber: body.caseNumber,
    });

    if (exists)
      throw new AppError('Case already exists with the same case number', 400);

    const subscription = await checkSubscriptionUnits(user.id);
    if (!subscription) throw new AppError('Subscription not found', 400);

    if (subscription) {
      subscription.remainingUnits = (subscription.remainingUnits ?? 0) - 1;
      if (subscription.remainingUnits < 0)
        throw new AppError('Subscription units are insufficient', 400);

      await subscription.save({ session });
    }

    const [createdCase] = await Case.create(
      [
        {
          doctor: user.id,

          title: body.title,

          description: body.description,

          patientName: body.patientName,

          patientType: body.patientType,

          patientAge: body.patientAge,

          caseType: body.caseType,

          caseNumber: body.caseNumber,

          estimatedDelivery: Date.now() + 1000 * 60 * 60 * 24,
        },
      ],
      { session },
    );
    if (typeof body.selectedTeeth === 'string') {
      body.selectedTeeth = JSON.parse(body.selectedTeeth);
    }

    await createCaseConfiguration(createdCase._id.toString(), body, session);

    await uploadCaseFiles(createdCase._id.toString(), files, user.id, session);

    const admin = await User.findOne({
      role: UserRole.ADMIN,
    });

    if (!admin) throw new AppError('Admin account not found', 500);

    await createActivity({
      relatedId: createdCase._id.toString(),
      userId: user.id,
      action: ActivityAction.CASE_CREATED,
      description: `${user.fullName} created the case`,
      relatedModel: ActivityActionRelatedTo.CASE,
    });

    await createNotification({
      user: admin._id.toString(),
      title: 'New Case Assigned',
      message: 'A new case has been assigned to you',
      type: NotificationType.CASE_ASSIGNED,
      relatedId: createdCase._id.toString(),
      relatedModel: 'Case',
    });

    await session.commitTransaction();

    return createdCase;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};
