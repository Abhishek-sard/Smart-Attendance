const express = require('express');
const router = express.Router();
const { markAttendance, getAttendance, getMyAttendance, markAttendanceQR } = require('../controllers/attendanceController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', authorizeRoles('admin', 'teacher'), markAttendance);
router.post('/qr', authorizeRoles('admin', 'teacher', 'student'), markAttendanceQR);
router.get('/student/me', authorizeRoles('admin', 'teacher', 'student'), getMyAttendance);

router.get('/:classId', authorizeRoles('admin', 'teacher'), getAttendance);


module.exports = router;
