import { AssignmentStatus } from './../enums/AssignmentStatus';
import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema(
  {
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(AssignmentStatus),
      default: AssignmentStatus.NOT_ASSIGNED,
    },

    assignedAt: Date,

    acceptedAt: Date,

    submittedAt: Date,

    adminNotes: String,

    assistantNotes: String,
  },
  {
    timestamps: true,
  },
);
export default mongoose.model('Assignment', AssignmentSchema);
