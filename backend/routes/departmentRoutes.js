
import express from "express";
import { Router } from "express";
import { getDepartments, createDepartment, deleteDepartment } from '../controllers/departmentController';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware';

router.use(verifyToken);

router.get('/', authorizeRoles('admin', 'teacher'), getDepartments);
router.post('/', authorizeRoles('admin'), createDepartment);
router.delete('/:id', authorizeRoles('admin'), deleteDepartment);

export default router;
