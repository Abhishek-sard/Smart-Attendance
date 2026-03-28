
import express from "express";
import { Router } from "express";
import { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } from '../controllers/leaveController';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware';

router.use(verifyToken);

router.post('/', authorizeRoles('student'), applyLeave);
router.get('/my', authorizeRoles('student'), getMyLeaves);
router.get('/', authorizeRoles('admin', 'teacher'), getAllLeaves);
router.put('/:id', authorizeRoles('admin', 'teacher'), updateLeaveStatus);

export default router;
