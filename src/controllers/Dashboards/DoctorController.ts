import { Request, Response, NextFunction } from 'express';
import { getDashboard } from '../../services/Dashboards/Doctor/Dashboard';

export const dashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctorId = req.user.id;
    const data = await getDashboard(doctorId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
