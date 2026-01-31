import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import api from '../api/client';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import Alert from '../components/Alert';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const token = searchParams.get('token');

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) setError('Invalid invite link.');
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setLoading(true);
        setError(null);

        try {
            const { data } = await api.post('/auth/register-via-invite', { token, name, password });
            dispatch(setCredentials({ user: data.data.user, token: data.data.accessToken }));
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="glass p-8 rounded-2xl max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Invalid Invite</h2>
                    <p className="text-slate-500 mt-2 mb-6">The invitation link is missing or invalid.</p>
                    <button onClick={() => navigate('/login')} className="btn-primary w-full">Go to Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Hero Section (Reused style for consistency) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-900 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center mix-blend-overlay"></div>

                <div className="relative z-10 p-12 text-white max-w-xl">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-8 border border-white/10">
                        <span className="font-bold text-2xl">AS</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">Join the team.</h1>
                    <p className="text-green-100 text-lg leading-relaxed">
                        You've been invited to collaborate. Create your account to get started immediately.
                    </p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">Invitation Accepted</span>
                        <h2 className="text-3xl font-bold text-slate-900 mt-4">Create Account</h2>
                        <p className="mt-2 text-slate-500">Set up your profile to continue.</p>
                    </div>

                    {error && (
                        <Alert
                            type="error"
                            message={error}
                            onClose={() => setError(null)}
                        />
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="input-field"
                                placeholder="Jane Doe"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="input-field"
                                placeholder="Create a strong password"
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center bg-green-600 hover:bg-green-700 hover:shadow-green-500/25">
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Complete Registration'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
