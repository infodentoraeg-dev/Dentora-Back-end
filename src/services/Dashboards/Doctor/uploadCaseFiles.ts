import { ClientSession } from 'mongoose';
import CaseFile from '../../../models/CaseFile';

export const uploadCaseFiles = async (
  caseId: string,
  files: Express.Multer.File[],
  userId: string,
  session: ClientSession,
) => {
  if (!files.length) return [];

  return await CaseFile.insertMany(
    files.map((file) => ({
      case: caseId,
      uploadedBy: userId,
      fileName: file.originalname,
      url: file.path,
      publicId: file.filename,
      fileSize: file.size,
      fileType: file.mimetype,
    })),
    { session },
  );
};
