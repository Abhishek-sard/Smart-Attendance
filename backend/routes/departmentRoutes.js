
import express from "express";
import { getDepartments, createDepartment, deleteDepartment } from '../controllers/departmentController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';
const router = express.Router();

router.use(verifyToken);

router.get('/', authorizeRoles('admin', 'teacher'), getDepartments);
router.post('/', authorizeRoles('admin'), createDepartment);
router.delete('/:id', authorizeRoles('admin'), deleteDepartment);

export default router;
