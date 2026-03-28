const Attendance = require('../models/Attendance');

// @desc    Mark attendance (Manual)
// @route   POST /api/attendance
// @access  Private/Admin/Teacher
const markAttendance = async (req, res) => {
    try {
        const { classId, date, records } = req.body;
        // records: [{ studentId, status, method }]

        // Use bulkWrite for efficiency or loop
        // Loop is easier for now
        for (const record of records) {
            await Attendance.findOneAndUpdate(
                { student: record.studentId, class: classId, date: date },
                {
                    status: record.status,
                    method: record.method || 'Manual'
                },
                { upsert: true, new: true }
            );
        }

        res.json({ message: 'Attendance marked successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get attendance for a class
// @route   GET /api/attendance/:classId
// @access  Private/Admin/Teacher
const getAttendance = async (req, res) => {
    try {
        const { classId } = req.params;
        const { date } = req.query;

        let query = { class: classId };
        if (date) {
            query.date = date;
        }

        const attendance = await Attendance.find(query)
            .populate('student', 'name studentId email');

        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get my attendance (Student)
// @route   GET /api/attendance/student/me
// @access  Private/Student
const getMyAttendance = async (req, res) => {
    try {
        const studentId = req.user.id;
        const records = await Attendance.find({ student: studentId })
            .populate('class', 'name subjectCode')
            .sort({ date: -1 });
        res.json(records);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Mark attendance via QR Scan (Student)
// @route   POST /api/attendance/qr
// @access  Private/Student
const markAttendanceQR = async (req, res) => {
    try {
        const { classId, date } = req.body; // QR contains classId and date
        const studentId = req.user.id;

        // Verify class exists
        const classObj = await require('../models/Class').findById(classId);
        if (!classObj) return res.status(404).json({ message: 'Class not found' });

        // Geofencing Check
        const { latitude, longitude } = req.body;
        if (classObj.location && classObj.location.latitude && classObj.location.longitude) {
            if (!latitude || !longitude) {
                return res.status(400).json({ message: 'Location data required' });
            }

            const { getDistanceFromLatLonInMeters } = require('../utils/geoUtils');
            const distance = getDistanceFromLatLonInMeters(
                latitude, longitude,
                classObj.location.latitude, classObj.location.longitude
            );

            if (distance > classObj.location.radius) {
                return res.status(400).json({
                    message: `You are too far from class! Distance: ${distance.toFixed(2)}m. Allowed: ${classObj.location.radius}m`
                });
            }
        }

        // Mark attendance
        const record = await Attendance.findOneAndUpdate(
            { student: studentId, class: classId, date: date },
            { $set: { status: 'Present', method: 'QR' } },
            { upsert: true, new: true }
        );

        res.json({ message: 'Attendance marked successfully', record });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { markAttendance, getAttendance, getMyAttendance, markAttendanceQR };
