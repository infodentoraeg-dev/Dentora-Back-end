import { Request, Response } from 'express';
import Activity from '../models/Activity';

export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find();
    res.status(200).json({
      success: true,
      total: activities.length,
      activities,
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

export const getActivitiesByCaseId = async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find({ case: req.params.id });
    res.status(200).json({
      success: true,
      total: activities.length,
      activities,
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

export const deleteActivitiesByCaseId = async (req: Request, res: Response) => {
  try {
    await Activity.deleteMany({ caseId: req.params.id });
    res.status(200).json({
      message: 'Activities deleted successfully',
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
