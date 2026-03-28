import { useAuth } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

const Header = () => {
    const { user } = useAuth();

    return (
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
            {/* Search / Breadcrumb Placeholder */}
            <div className="flex items-center bg-slate-100 rounded-full px-4 py-1.5 w-64 text-slate-500">
                <Search size={18} className="mr-2" />
                <input type="text" placeholder="Search..." className="bg-transparent border-none focus:outline-none text-sm w-full" />
            </div>

            <div className="flex items-center space-x-6">
                <button className="text-slate-500 hover:text-slate-700 relative">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-slate-200"></div>

                <div className="flex items-center space-x-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name}</p>
                        <p className="text-xs text-slate-500 font-medium capitalize">{user?.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
