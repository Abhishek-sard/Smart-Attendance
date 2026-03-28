import express from "express";
import { getClasses, createClass, addStudentToClass } from '../controllers/classController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.use(verifyToken);

router.get('/', authorizeRoles('admin', 'teacher'), getClasses);
router.post('/', authorizeRoles('admin'), createClass);
router.put('/:id/student', authorizeRoles('admin', 'teacher'), addStudentToClass);

export default router;