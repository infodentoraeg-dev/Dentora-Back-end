import express from 'express';

import {
  assignCase,
  getAssignmentsByCase,
  acceptAssignment,
  submitAssignment,
  rejectAssignment,
} from '../controllers/AssignmentController';

import auth from '../middleware/Auth';

const router = express.Router();

// Admin assign
router.post('/case/:id/assign', auth(), assignCase);

// Get history of assignments
router.get('/case/:caseId', auth(), getAssignmentsByCase);

// Assistant accept
router.patch('/:id/accept', auth(), acceptAssignment);

// Assistant submit
router.patch('/:id/submit', auth(), submitAssignment);

// Assistant reject
router.patch('/:id/reject', auth(), rejectAssignment);

export default router;
