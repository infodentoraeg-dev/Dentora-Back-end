import mongoose from 'mongoose';
import { ActivityActionRelatedTo } from '../enums/ActivityActionRelatedTo';

const ActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    relatedModel: {
      type: String,
      enum: Object.values(ActivityActionRelatedTo),
    },
  },
  { timestamps: true },
);

export default mongoose.model('Activity', ActivitySchema);
