import express from 'express';
import auth from '../middleware/Auth';
import {
  approvePayment,
  createPayment,
  getAllPayments,
  getMyPayments,
  rejectPayment,
} from '../controllers/PaymentController';

const router = express.Router();

router.post('/', auth(), createPayment);

router.get('/me', auth(), getMyPayments);

router.get('/', auth(), getAllPayments);

router.patch('/:id/approve', auth(), approvePayment);

router.patch('/:id/reject', auth(), rejectPayment);

export default router;
