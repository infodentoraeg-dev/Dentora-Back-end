import express from 'express';

import {
  getPlanById,
  createPlan,
  getAllPlans,
  updatePlanById,
  deletePlanById,
} from '../controllers/PlanController';
import auth from '../middleware/Auth';

const router = express.Router();

router.post('/', auth(), createPlan);
router.get('/', auth(), getAllPlans);
router.get('/:id', auth(), getPlanById);
router.patch('/:id', auth(), updatePlanById);
router.delete('/:id', auth(), deletePlanById);

export default router;
