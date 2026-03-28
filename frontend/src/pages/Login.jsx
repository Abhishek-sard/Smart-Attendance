import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Left Side - Image/Brand */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-center px-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/20 z-0"></div>
                <div className="relative z-10">
                    <h1 className="text-5xl font-bold mb-6">Welcome Back</h1>
                    <p className="text-lg text-slate-300 mb-8">
                        Streamline your attendance tracking with our digital solution.
                        Efficient, accurate, and easy to use.
                    </p>
                    <div className="flex space-x-4">
                        <div className="h-2 w-12 bg-blue-500 rounded"></div>
                        <div className="h-2 w-8 bg-slate-600 rounded"></div>
                        <div className="h-2 w-4 bg-slate-600 rounded"></div>
                    </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute top-12 right-12 w-32 h-32 bg-purple-500 rounded-full blur-2xl opacity-20"></div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-800">Sign In</h2>
                        <p className="text-slate-500 mt-2">Access your account dashboard</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                                <span className="ml-2 text-sm text-slate-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 transition flex items-center justify-center"
                        >
                            <LogIn className="mr-2" size={20} />
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-800 transition">
                            Create a student account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
