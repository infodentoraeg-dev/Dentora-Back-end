import Notification from "../models/Notification";
import { NotificationType } from "../enums/NotificationType";

interface CreateNotificationParams {
  user: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  relatedId?: string;
  relatedModel?: string;
}


export const createNotification = async ({
  user,
  title,
  message,
  type,
  link,
  relatedId,
  relatedModel,
}: CreateNotificationParams) => {

  const notification = await Notification.create({
    user,
    title,
    message,
    type,
    link,
    relatedId,
    relatedModel,
  });

  return notification;
};