import CaseFile from '../models/CaseFile';
import { Request, Response } from 'express';
import { createActivity } from '../services/Activity';
import { ActivityAction } from '../enums/ActivityAction';
import { createNotification } from '../services/Notification';
import User from '../models/User';
import { UserRole } from '../enums/UserRole';
import { NotificationType } from '../enums/NotificationType';
import { ActivityActionRelatedTo } from '../enums/ActivityActionRelatedTo';

export const uploadCaseFiles = async (req: Request, res: Response) => {
  const caseId = req.params.id;
  const files = req.files as Express.Multer.File[];

  const uploadedBy = req.user.id;

  if (!files || files.length === 0) {
    return res.status(400).json({
      message: 'No files uploaded',
    });
  }
  const docs = files?.map((file) => ({
    case: caseId,
    uploadedBy,
    fileName: file.originalname,
    url: file.path,
    publicId: file.filename,
    fileSize: file.size,
    fileType: String(file.mimetype.split('/')[1]).toUpperCase(),
  }));
  const result = await CaseFile.insertMany(docs);

  const admin = await User.findOne({
    role: UserRole.ADMIN,
  });
  if (!admin) {
    return res.status(500).json({
      message: 'Admin account not found',
    });
  }

  await createNotification({
    user: admin._id.toString(),
    title: `Case ${caseId} Files Uploaded`,
    message: `${files.length} files has been uploaded`,
    type: NotificationType.FILE_UPLOADED,
    relatedId: caseId.toString(),
    relatedModel: 'Case',
  });

  await createActivity({
    relatedId: caseId.toString(),
    userId: req.user.id,
    action: ActivityAction.FILE_UPLOADED,
    description: `${req.user.fullName} uploaded the case files`,
    relatedModel: ActivityActionRelatedTo.CASE,
  });

  res.status(201).json({
    message: 'Files uploaded successfully',
    result,
  });
};

export const getCaseFiles = async (req: Request, res: Response) => {
  const caseId = req.params.id;
  const result = await CaseFile.find({ case: caseId }).populate(
    'uploadedBy',
    'fullName -_id',
  );
  res.status(200).json({
    message: 'Files retrieved successfully',
    total: result.length,
    result,
  });
};

export const deleteCaseFiles = async (req: Request, res: Response) => {
  const caseId = req.params.id;
  const result = await CaseFile.deleteMany({ case: caseId });
  res.status(200).json({
    message: 'Files retrieved successfully',
    result,
  });
};

export const getCaseFileById = async (req: Request, res: Response) => {
  const caseId = req.params.id;
  const fileId = req.params.fileId;
  const result = await CaseFile.findOne({ case: caseId, _id: fileId });
  res.status(200).json({
    message: 'File retrieved successfully',
    result,
  });
};

export const deleteCaseFileById = async (req: Request, res: Response) => {
  const caseId = req.params.id;
  const fileId = req.params.fileId;
  const result = await CaseFile.deleteOne({ case: caseId, _id: fileId });
  res.status(200).json({
    message: 'File deleted successfully',
    result,
  });
};

export const getMyFiles = async (req: Request, res: Response) => {
  try {
    const files = await CaseFile.find({ uploadedBy: req.user.id });
    res.status(200).json({
      success: true,
      total: files.length,
      files,
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
