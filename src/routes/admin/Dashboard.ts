import express from 'express';
import auth from '../../middleware/Auth';
import { dashboard } from '../../controllers/Dashboards/AdminController';
const router = express.Router();

router.get('/dashboard', auth(), dashboard);
export default router;
