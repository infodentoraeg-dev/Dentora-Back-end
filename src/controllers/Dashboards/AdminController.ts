import { Request, Response, NextFunction } from 'express';
import { getDashboard } from '../../services/Dashboards/Admin/Dashboard';

export const dashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getDashboard();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
