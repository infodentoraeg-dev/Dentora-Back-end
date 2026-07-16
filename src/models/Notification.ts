import mongoose from 'mongoose';
import { NotificationType } from '../enums/NotificationType';

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: Object.values(NotificationType),
      default: NotificationType.CASE_CREATED,
    },

    isRead: { type: Boolean, default: false },

    link: String,
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    relatedModel: {
      type: String,
    },
  },

  {
    timestamps: true,
  },
);

export default mongoose.model('Notification', NotificationSchema);
