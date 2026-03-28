const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student'],
        default: 'student',
    },
    // Specific to students
    studentId: {
        type: String,
        unique: true,
        sparse: true, // Only for students
    },
    // Specific to teachers
    employeeId: {
        type: String,
        unique: true,
        sparse: true, // Only for teachers
    },
    // Specific to teachers/students
    department: {
        type: String,
    },
    phone: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);
