import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import Case from '../models/Case';
import { AssignmentStatus } from '../enums/AssignmentStatus';
import { createActivity } from '../services/Activity';
import { ActivityAction } from '../enums/ActivityAction';
import { createNotification } from '../services/Notification';
import { NotificationType } from '../enums/NotificationType';
import User from '../models/User';
import { ActivityActionRelatedTo } from '../enums/ActivityActionRelatedTo';

// Admin Assign Case To Assistant
export const assignCase = async (req: Request, res: Response) => {
  try {
    const { assistantId, adminNotes } = req.body;
    const caseId = req.params.id;
    const caseExist = await Case.findById(caseId);
    const assistant = await User.findById(assistantId).select('fullName');
    if (!caseExist) {
      return res.status(404).json({
        message: 'Case not found',
      });
    }
    if (!assistant) {
      return res.status(404).json({
        message: 'Assistant not found',
      });
    }

    // Check if already assigned
    const existingAssignment = await Assignment.findOne({
      case: caseId,
      status: {
        $in: [
          AssignmentStatus.ASSIGNED,
          AssignmentStatus.ACCEPTED,
          AssignmentStatus.IN_PROGRESS,
        ],
      },
    });

    if (existingAssignment) {
      return res.status(400).json({
        message: 'Case already assigned',
      });
    }

    const assignment = await Assignment.create({
      case: caseId.toString(),

      assignedBy: req.user.id,

      assignedTo: assistantId,

      status: AssignmentStatus.ASSIGNED,

      assignedAt: new Date(),

      adminNotes,
    });

    // Activity
    await createActivity({
      relatedId: caseId.toString(),

      userId: req.user.id,

      action: ActivityAction.CASE_ASSIGNED,

      description: `${req.user.fullName} assigned the case to ${assistant.fullName}`,
      relatedModel: ActivityActionRelatedTo.ASSIGNMENT,
    });

    // Notification Assistant
    await createNotification({
      user: assistantId,

      title: 'New Case Assigned',

      message: 'You have been assigned a new case',

      type: NotificationType.CASE_ASSIGNED,

      relatedId: caseId.toString(),

      relatedModel: 'Case',
    });

    res.status(201).json({
      message: 'Case assigned successfully',

      assignment,
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

// Get Assignments By Case
export const getAssignmentsByCase = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find({
      case: req.params.caseId,
    })
      .populate('assignedTo', 'fullName')
      .populate('assignedBy', 'fullName')
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      total: assignments.length,

      assignments,
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

// Assistant Accept Assignment
export const acceptAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      assignedTo: req.user.id,
    });

    if (!assignment) {
      return res.status(404).json({
        message: 'Assignment not found',
      });
    }

    assignment.status = AssignmentStatus.ACCEPTED;

    assignment.acceptedAt = new Date();

    await assignment.save();

    await createActivity({
      relatedId: assignment.case.toString(),

      userId: req.user.id,

      action: ActivityAction.ASSIGNMENT_ACCEPTED,

      description: `${req.user.fullName} accepted assignment`,
      relatedModel: ActivityActionRelatedTo.ASSIGNMENT,
    });

    res.status(200).json({
      message: 'Assignment accepted',
      assignment,
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

// Assistant Submit Case
export const submitAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.id,

      assignedTo: req.user.id,
    });

    if (!assignment) {
      return res.status(404).json({
        message: 'Assignment not found',
      });
    }

    assignment.status = AssignmentStatus.SUBMITTED;

    assignment.submittedAt = new Date();

    assignment.assistantNotes = req.body.assistantNotes;

    await assignment.save();

    await createActivity({
      relatedId: assignment.case.toString(),

      userId: req.user.id,

      action: ActivityAction.CASE_COMPLETED,

      description: `${req.user.fullName} submitted the case`,
      
      relatedModel: ActivityActionRelatedTo.ASSIGNMENT,
    });

    res.status(200).json({
      message: 'Case submitted successfully',

      assignment,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Assistant Reject Assignment
export const rejectAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.id,

      assignedTo: req.user.id,
    });

    if (!assignment) {
      return res.status(404).json({
        message: 'Assignment not found',
      });
    }

    assignment.status = AssignmentStatus.REJECTED;

    await assignment.save();

    await createActivity({
      relatedId: assignment.case.toString(),

      userId: req.user.id,

      action: ActivityAction.ASSIGNMENT_ACCEPTED,

      description: `${req.user.fullName} rejected assignment`,
      relatedModel: ActivityActionRelatedTo.ASSIGNMENT,
    });

    res.status(200).json({
      message: 'Assignment rejected',

      assignment,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
