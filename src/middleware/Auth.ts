import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const auth = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null;

      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as JwtPayload & {
        id?: string;
        _id?: string;
        role: string;
      };

      req.user = {
        id: decoded.id || decoded._id!,
        role: decoded.role,
        fullName: decoded.fullName,
      };

      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: 'Access denied - insufficient permissions' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

export default auth;
