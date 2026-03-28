import express from "express";
import { getDashboardStats, getClassReport } from '../controllers/reportController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';
const router = express.Router();

router.use(verifyToken);
router.use(authorizeRoles('admin', 'teacher'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/class/:classId', getClassReport);

export default router;
