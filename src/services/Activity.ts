import { ActivityAction } from '../enums/ActivityAction';
import { ActivityActionRelatedTo } from '../enums/ActivityActionRelatedTo';
import Activity from '../models/Activity';

export const createActivity = async ({
  relatedId,
  userId,
  action,
  description,
  relatedModel,
}: {
  relatedId: string;
  userId: string;
  action: ActivityAction;
  description: string;
  relatedModel: ActivityActionRelatedTo;
}) => {
  return Activity.create({
    relatedId,
    user: userId,
    action,
    description,
    relatedModel,
  });
};
