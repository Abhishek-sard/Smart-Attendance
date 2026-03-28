const Attendance = require('../models/Attendance');

// @desc    Get my attendance
// @route   GET /api/attendance/my-attendance
// @access  Private/Student
const getMyAttendance = async (req, res) => {
    try {
        const studentId = req.user.id;
        const attendance = await Attendance.find({ student: studentId })
            .populate('class', 'name subjectCode');

        // Group by class?
        // Let's grouping for basic stats
        // { "Physics": { total: 20, present: 18, ... } }

        res.json(attendance);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { getMyAttendance };
