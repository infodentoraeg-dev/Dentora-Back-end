import express from 'express';
import {
  cancelCaseById,
  completeCaseById,
  createCase,
  deleteCaseById,
  getAllCases,
  getCaseById,
  getCasesByDoctorId,
  getMyCases,
  updateCaseById,
} from '../controllers/CaseController';
import auth from '../middleware/Auth';
import {
  deleteCaseFileById,
  deleteCaseFiles,
  getCaseFileById,
  getCaseFiles,
  getMyFiles,
  uploadCaseFiles,
} from '../controllers/CaseFileController';
import {
  getActivitiesByCaseId,
  deleteActivitiesByCaseId,
} from '../controllers/ActivityController';

import upload from '../config/multer';
import {
  createCaseConfiguration,
  deleteCaseConfiguration,
  getCaseConfiguration,
  updateCaseConfiguration,
} from '../controllers/CaseConfigurationController';
const router = express.Router();

router.get('/', auth(), getAllCases);
router.post('/', auth(), createCase);

router.get('/me', auth(), getMyCases);
router.get('/me/files', auth(), getMyFiles);
router.get('/doctor/:id', auth(), getCasesByDoctorId);

router.get('/:id', auth(), getCaseById);
router.patch('/:id', auth(), updateCaseById);
router.delete('/:id', auth(), deleteCaseById);

router.post('/:id/files', auth(), upload.array('files', 10), uploadCaseFiles);
router.get('/:id/files', auth(), getCaseFiles);
router.delete('/:id/files', auth(), deleteCaseFiles);
router.get('/:id/files/:fileId', auth(), getCaseFileById);
router.delete('/:id/files/:fileId', auth(), deleteCaseFileById);

router.post('/:id/configuration', auth(), createCaseConfiguration);
router.get('/:id/configuration', auth(), getCaseConfiguration);
router.patch('/:id/configuration', auth(), updateCaseConfiguration);
router.delete('/:id/configuration', auth(), deleteCaseConfiguration);

router.post('/:id/complete', auth(), completeCaseById);
router.post('/:id/cancel', auth(), cancelCaseById);

router.get('/:id/activities', auth(), getActivitiesByCaseId);
router.delete('/:id/activities', auth(), deleteActivitiesByCaseId);

export default router;
