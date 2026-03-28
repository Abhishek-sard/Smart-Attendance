import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Building, UserCheck, LogOut, BookOpen, BarChart, QrCode, FileText } from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path
            ? 'bg-blue-600/20 text-blue-400 border-r-4 border-blue-500'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200';
    };

    const NavItem = ({ to, icon: Icon, label }) => (
        <li>
            <Link
                to={to}
                className={`flex items-center p-3 text-sm font-medium transition-all duration-200 ${isActive(to)}`}
            >
                <Icon size={20} className="mr-3" />
                {label}
            </Link>
        </li>
    );

    return (
        <div className="bg-slate-900 text-white w-64 min-h-screen flex flex-col shadow-xl z-20">
            <div className="p-6 border-b border-slate-800 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 font-bold text-lg">E</div>
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Ed-Track</h2>
                    <p className="text-xs text-slate-400">Digital Attendance</p>
                </div>
            </div>

            <nav className="flex-1 py-6 px-2 overflow-y-auto custom-scrollbar">
                <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main</p>
                <ul className="space-y-1 mb-6">
                    <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                </ul>

                {/* Admin Links */}
                {user?.role === 'admin' && (
                    <>
                        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Administration</p>
                        <ul className="space-y-1 mb-6">
                            <NavItem to="/users" icon={Users} label="Users" />
                            <NavItem to="/departments" icon={Building} label="Departments" />
                            <NavItem to="/classes" icon={BookOpen} label="Classes" />
                        </ul>
                    </>
                )}

                {/* Teacher Links */}
                {(user?.role === 'admin' || user?.role === 'teacher') && (
                    <>
                        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Management</p>
                        <ul className="space-y-1 mb-6">
                            <NavItem to="/attendance" icon={UserCheck} label="Attendance" />
                            <NavItem to="/leave-requests" icon={FileText} label="Leave Requests" />
                            <NavItem to="/reports" icon={BarChart} label="Reports" />
                        </ul>
                    </>
                )}

                {/* Student Links */}
                {user?.role === 'student' && (
                    <>
                        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Student Portal</p>
                        <ul className="space-y-1 mb-6">
                            <NavItem to="/my-attendance" icon={BarChart} label="My Attendance" />
                            <NavItem to="/leaves" icon={FileText} label="Apply Leave" />
                            <NavItem to="/scan-qr" icon={QrCode} label="Scan QR" />
                        </ul>
                    </>
                )}
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-900">
                <button
                    onClick={logout}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors duration-200"
                >
                    <LogOut size={20} className="mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
