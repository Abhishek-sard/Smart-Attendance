import express from "express";
import { Router } from "express";
import { getClasses, createClass, addStudentToClass } from '../controllers/classController';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware'; 

router.use(verifyToken);

router.get('/', authorizeRoles('admin', 'teacher'), getClasses);
router.post('/', authorizeRoles('admin'), createClass);
router.put('/:id/student', authorizeRoles('admin', 'teacher'), addStudentToClass);

export default router;