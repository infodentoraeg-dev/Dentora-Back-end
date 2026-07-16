import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { UserRole } from '../enums/UserRole';

export const validateAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const assistant = await User.findById(req.body.assignedTo);

  if (!assistant) {
    return res.status(404).json({
      message: 'Assistant not found',
    });
  }

  if (assistant.role !== UserRole.ASSISTANT) {
    return res.status(400).json({
      message: 'User is not assistant',
    });
  }

  next();
};
