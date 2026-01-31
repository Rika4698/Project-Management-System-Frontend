import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, selectCurrentUser } from '../store/authSlice';
import api from '../api/client';
import { Loader2, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);

    if (user) return <Navigate to="/" replace />;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            dispatch(setCredentials({ user: data.data.user, token: data.data.accessToken }));
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center mix-blend-overlay"></div>

                <div className="relative z-10 p-12 text-white max-w-xl">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-8 border border-white/10">
                        <span className="font-bold text-2xl">AS</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Manage your projects with confidence.</h1>
                    <p className="text-blue-100 text-lg leading-relaxed">
                        The most secure and efficient way to handle role-based project management.
                        Streamline your workflow today.
                    </p>

                   
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
                        <p className="mt-2 text-slate-500">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center animate-in fade-in slide-in-from-top-2">
                            <span className="mr-2">⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-field"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center">
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign In'}
                        </button>
                    </form>

                    <div className="pt-4 text-center text-sm text-slate-500">
                        Don't have an account?
                        <span className="text-slate-400 ml-1">Contact your admin for an invite.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
