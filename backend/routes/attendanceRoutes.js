import express from 'express';
import { markAttendance, getAttendance, getMyAttendance, markAttendanceQR } from '../controllers/attendanceController.js';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware.js';
const router = express.Router();

router.use(verifyToken);

router.post('/', authorizeRoles('admin', 'teacher'), markAttendance);
router.post('/qr', authorizeRoles('admin', 'teacher', 'student'), markAttendanceQR);
router.get('/student/me', authorizeRoles('admin', 'teacher', 'student'), getMyAttendance);

router.get('/:classId', authorizeRoles('admin', 'teacher'), getAttendance);


export default router;