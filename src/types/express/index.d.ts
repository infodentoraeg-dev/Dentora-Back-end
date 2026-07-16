import 'multer';

export {};

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: string;
        fullName: string;
      };
      files?: Express.Multer.File[];
    }
  }
}
