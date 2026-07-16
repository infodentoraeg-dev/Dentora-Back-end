import express from 'express';

import {
  getSubscriptionById,
  createSubscription,
  getAllSubscriptions,
  updateSubscriptionById,
  cancelSubscriptionById,
} from '../controllers/SubscriptionController';
import auth from '../middleware/Auth';

const router = express.Router();

router.post('/', auth(), createSubscription);
router.get('/', auth(), getAllSubscriptions);
router.get('/:id', auth(), getSubscriptionById);
router.patch('/:id', auth(), updateSubscriptionById);
router.delete('/:id', auth(), cancelSubscriptionById);

export default router;
