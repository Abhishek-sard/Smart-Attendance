import express from "express";
import { Router } from "express";
import { getDashboardStats, getClassReport } from '../controllers/reportController';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware';

router.use(verifyToken);
router.use(authorizeRoles('admin', 'teacher'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/class/:classId', getClassReport);

export default router;
