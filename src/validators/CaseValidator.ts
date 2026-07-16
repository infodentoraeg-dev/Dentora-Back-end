import { Request, Response, NextFunction } from 'express';
import { CaseType } from '../enums/CaseType';

export const validateCreateCase = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, description, caseType, priority } = req.body;

  if (!title || title.length < 3) {
    return res.status(400).json({
      message: 'Title must be at least 3 characters',
    });
  }

  if (!description || description.length < 10) {
    return res.status(400).json({
      message: 'Description is too short',
    });
  }

  if (caseType && !Object.values(CaseType).includes(caseType)) {
    return res.status(400).json({
      message: 'Invalid case type',
    });
  }

  next();
};
