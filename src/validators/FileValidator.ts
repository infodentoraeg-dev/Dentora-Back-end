import { Request, Response, NextFunction } from 'express';

export const validateFiles = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res.status(400).json({
      message: 'Files required',
    });
  }

  const maxSize = 500 * 1024 * 1024;

  for (const file of files) {
    if (file.size > maxSize) {
      return res.status(400).json({
        message: `${file.originalname} is too large`,
      });
    }
  }

  next();
};
