const express = require('express');
const router = express.Router();
const { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } = require('../controllers/leaveController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', authorizeRoles('student'), applyLeave);
router.get('/my', authorizeRoles('student'), getMyLeaves);
router.get('/', authorizeRoles('admin', 'teacher'), getAllLeaves);
router.put('/:id', authorizeRoles('admin', 'teacher'), updateLeaveStatus);

module.exports = router;
