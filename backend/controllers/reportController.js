import Class from '../models/Class.js';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';


const getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalTeachers = await User.countDocuments({ role: 'teacher' });
        const totalClasses = await Class.countDocuments();

        // Simple attendance stats (Present vs Absent today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendanceToday = await Attendance.find({ date: { $gte: today } });
        const presentCount = attendanceToday.filter(a => a.status === 'Present').length;
        const absentCount = attendanceToday.filter(a => a.status === 'Absent').length;

        res.json({
            totalStudents,
            totalTeachers,
            totalClasses,
            attendanceToday: {
                present: presentCount,
                absent: absentCount,
                total: attendanceToday.length
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get Class Attendance Report
// @route   GET /api/reports/class/:classId
// @access  Private/Admin/Teacher
const getClassReport = async (req, res) => {
    try {
        const { classId } = req.params;
        const classObj = await Class.findById(classId).populate('students', 'name studentId');

        if (!classObj) return res.status(404).json({ message: 'Class not found' });

        const attendance = await Attendance.find({ class: classId });

        // Aggregate by student
        const report = classObj.students.map(student => {
            const studentRecords = attendance.filter(a => a.student.toString() === student._id.toString());
            const total = studentRecords.length;
            const present = studentRecords.filter(a => a.status === 'Present').length;
            const absent = studentRecords.filter(a => a.status === 'Absent').length;
            const late = studentRecords.filter(a => a.status === 'Late').length; // excess feature
            const percentage = total === 0 ? 0 : ((present / total) * 100).toFixed(1);

            return {
                studentId: student.studentId,
                name: student.name,
                total,
                present,
                absent,
                percentage
            };
        });

        res.json(report);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


export  { getDashboardStats, getClassReport };
