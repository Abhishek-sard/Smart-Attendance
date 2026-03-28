import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, UserCheck, Clock, AlertCircle, TrendingUp, Calendar, QrCode } from 'lucide-react';
import StudentQRScan from './student/StudentQRScan';

const Dashboard = () => {
    const { user } = useAuth();

    if (user?.role === 'student') {
        return <StudentQRScan />;
    }

    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                {trend && (
                    <p className={`text-xs font-medium mt-2 flex items-center ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendingUp size={12} className="mr-1" />
                        {trend > 0 ? '+' : ''}{trend}% from last month
                    </p>
                )}
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-slate-500">Welcome back, {user?.name}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Students"
                    value="1,234"
                    icon={Users}
                    color="bg-blue-500"
                    trend={12}
                />
                <StatCard
                    title="Attendance Rate"
                    value="92%"
                    icon={UserCheck}
                    color="bg-green-500"
                    trend={5}
                />
                <StatCard
                    title="On Time"
                    value="88%"
                    icon={Clock}
                    color="bg-purple-500"
                    trend={2}
                />
                <StatCard
                    title="Absent Today"
                    value="45"
                    icon={AlertCircle}
                    color="bg-red-500"
                    trend={-8}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area (e.g., Chart or Table) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800">Attendance Overview</h3>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                            <button className="px-3 py-1 text-xs font-medium bg-white rounded shadow-sm text-slate-800">Weekly</button>
                            <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-800">Monthly</button>
                        </div>
                    </div>

                    <div className="h-64 flex items-center justify-center bg-slate-50 rounded border border-dashed border-slate-300">
                        <p className="text-slate-400 text-sm">Attendance Chart Visualization Placeholder</p>
                    </div>
                </div>

                {/* Right Side Widgets */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        {user?.role === 'admin' && (
                            <>
                                <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 transition flex items-center">
                                    <Users size={16} className="mr-3 text-blue-500" /> Add New User
                                </button>
                                <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 transition flex items-center">
                                    <Clock size={16} className="mr-3 text-purple-500" /> Manage Schedules
                                </button>
                            </>
                        )}
                        {user?.role === 'teacher' && (
                            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 transition flex items-center">
                                <UserCheck size={16} className="mr-3 text-green-500" /> Mark Attendance
                            </button>
                        )}
                        {/* Student actions removed as they are now the main view or can be added to the QR view if needed later */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
