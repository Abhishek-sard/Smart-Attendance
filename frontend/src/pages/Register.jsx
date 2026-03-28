import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, BookOpen, Phone, Briefcase } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [studentId, setStudentId] = useState('');
    const [department, setDepartment] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [role, setRole] = useState('student');
    const [employeeId, setEmployeeId] = useState('');

    // ... (rest of state)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const payload = {
            name,
            email,
            password,
            role,
            department,
            phone
        };

        if (role === 'student') payload.studentId = studentId;
        if (role === 'teacher') payload.employeeId = employeeId;

        const result = await register(payload);

        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Left Side (unchanged) */}
            <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white flex-col justify-center px-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/10 z-0"></div>
                <div className="relative z-10">
                    <h1 className="text-5xl font-bold mb-6">Join Us</h1>
                    <p className="text-lg text-blue-100 mb-8">
                        Create your account to manage attendance, apply for leaves, and track progress.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                            <h3 className="font-bold text-xl mb-1">Real-time</h3>
                            <p className="text-sm opacity-80">Track attendance instantly</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                            <h3 className="font-bold text-xl mb-1">Secure</h3>
                            <p className="text-sm opacity-80">Your data is safe with us</p>
                        </div>
                    </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-12 left-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-12 right-12 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-md my-8">
                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
                        <p className="text-slate-500 mt-2">Sign up to get started</p>
                    </div>

                    {/* Role Selection */}
                    <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('student')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${role === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Student
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('teacher')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${role === 'teacher' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Teacher
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* ID Field (Dynamic) */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {role === 'student' ? 'Student ID' : 'Employee ID'}
                                </label>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-3 text-slate-400" size={18} />
                                    {role === 'student' ? (
                                        <input
                                            type="text"
                                            value={studentId}
                                            onChange={(e) => setStudentId(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                                            placeholder="STD-001"
                                            required
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={employeeId}
                                            onChange={(e) => setEmployeeId(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                                            placeholder="EMP-001"
                                            required
                                        />
                                    )}
                                </div>
                            </div>
                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                                        placeholder="(555) 000-0000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                                    placeholder="Computer Science"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition flex items-center justify-center mt-2"
                        >
                            <UserPlus className="mr-2" size={20} />
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-slate-900 hover:text-blue-600 transition">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
