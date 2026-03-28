const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Department = require('./models/Department');
const Class = require('./models/Class');
const Attendance = require('./models/Attendance');
const Leave = require('./models/Leave');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await User.deleteMany({});
        await Department.deleteMany({});
        await Class.deleteMany({});
        await Attendance.deleteMany({});
        await Leave.deleteMany({});

        // Create Admin
        const salt = await bcrypt.genSalt(10);
        const adminHash = await bcrypt.hash('admin123', salt);
        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@example.com',
            password: adminHash,
            role: 'admin'
        });
        console.log('Admin created: admin@example.com / admin123');

        // Create Department
        const csDept = await Department.create({
            name: 'Computer Science',
            code: 'CS',
            headOfDepartment: admin._id
        });
        console.log('Department created: Computer Science');

        // Create Teacher
        const teacherHash = await bcrypt.hash('teacher123', salt);
        const teacher = await User.create({
            name: 'Samrajya Teacher',
            email: 'teacher@example.com',
            password: teacherHash,
            role: 'teacher',
            department: 'Computer Science'
        });
        console.log('Teacher created: teacher@example.com / teacher123');

        // Create Students
        const studentHash = await bcrypt.hash('student123', salt);
        const student1 = await User.create({
            name: 'Alice Student',
            email: 'alice@example.com',
            password: studentHash,
            role: 'student',
            studentId: 'CS001',
            department: 'Computer Science'
        });
        const student2 = await User.create({
            name: 'Bob Student',
            email: 'bob@example.com',
            password: studentHash,
            role: 'student',
            studentId: 'CS002',
            department: 'Computer Science'
        });
        console.log('Students created: alice@example.com / student123, bob@example.com / student123');

        // Create Standard Class
        const physicsClass = await Class.create({
            name: 'Physics 101',
            subjectCode: 'PHY101',
            department: 'Computer Science',
            teacher: teacher._id,
            students: [student1._id, student2._id],
            schedule: [{ day: 'Monday', startTime: '10:00', endTime: '11:00' }]
        });
        console.log('Class created: Physics 101');

        // Create Geofenced Class (Null Island)
        const geoClass = await Class.create({
            name: 'Geofenced Demo (Null Island)',
            subjectCode: 'GEO101',
            department: 'Computer Science',
            teacher: teacher._id,
            students: [student1._id, student2._id],
            schedule: [{ day: 'Friday', startTime: '09:00', endTime: '10:00' }],
            location: {
                latitude: 0,
                longitude: 0,
                radius: 100
            }
        });
        console.log('Class created: Geofenced Demo (Lat: 0, Lng: 0)');

        console.log('Database Seeded Successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
