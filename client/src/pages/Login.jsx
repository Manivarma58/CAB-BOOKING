import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // user or admin
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please enter email and password');
    }

    setLoading(true);
    try {
      const res = await userAPI.login({ email, password });
      login(res.data, res.data.token);

      if (res.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/uhome');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-lightbg">
      <Navbar />

      <div className="flex flex-1 grid lg:grid-cols-2">
        {/* Left Side: Aesthetic Glassmorphism Form Container */}
        <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
          <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            
            {/* Headline */}
            <div className="text-left">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="mt-2 text-xs text-slate-500">
                New to UCab?{' '}
                <Link to="/register" className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5">
                  Create an account <ArrowRight className="h-3 w-3" />
                </Link>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Role Selection Toggle */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Account Role</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`rounded-xl border py-2 text-xs font-bold transition duration-200 ${
                      role === 'user'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-slate-300 text-slate-550 hover:bg-slate-50'
                    }`}
                  >
                    Passenger / Driver
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`rounded-xl border py-2 text-xs font-bold transition duration-200 ${
                      role === 'admin'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-slate-300 text-slate-550 hover:bg-slate-50'
                    }`}
                  >
                    Administrator
                  </button>
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-xs focus:border-primary focus:outline-none"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                  <a href="#forgot" onClick={() => toast.error('OTP bypass is active. Re-register if password is lost.')} className="text-xs font-semibold text-primary hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-xs focus:border-primary focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-50 transition shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" /> Sign In
                  </>
                )}
              </button>
            </form>

            {/* Social Logins */}
            <div className="space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative bg-white px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Or Connect With
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => toast.success('Google authentication simulated successfully!')}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-650 hover:bg-slate-50 transition bg-white"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => toast.success('Apple authentication simulated successfully!')}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-650 hover:bg-slate-50 transition bg-white"
                >
                  <svg className="h-4 w-4 fill-current text-slate-900" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C3.79 16.2 3.12 9.78 6.44 6.27c1.65-1.74 3.47-1.63 4.54-1.02 1.25.68 1.9 1.13 3.25 0 1.2-.95 3.03-1.22 4.41.35-3.3 2.1-2.48 7.37.95 8.78-1 .85-1.92 2.37-2.54 5.9M14.6 3.18c.8-1.07.6-2.2-.1-2.92-1.03.1-2.07.82-2.52 1.93-.8 1.08-.57 2.22.1 2.92.9-.1 2.05-.83 2.52-1.93"/>
                  </svg>
                  <span>Apple ID</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Animated Decorative Graphic panel */}
        <div className="hidden lg:flex flex-col justify-center bg-darkbg bg-gradient-primary animate-gradient p-16 text-white text-left relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-20 right-10 h-32 w-32 rounded-full bg-cyan-400 blur-3xl animate-float"></div>
            <div className="absolute bottom-20 left-10 h-44 w-44 rounded-full bg-pink-400 blur-3xl animate-float" style={{ animationDelay: '2.5s' }}></div>
          </div>

          <div className="max-w-md relative z-10 space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-wider text-secondary uppercase border border-white/10 backdrop-blur-md">
              Secure Transport Portal
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight">Navigate Delhi NCR Comfortably</h1>
            <p className="text-sm font-light leading-relaxed text-slate-200">
              Access your saved travel checkpoints, coordinate booking schedules, review previous receipts, and track active drivers in real-time.
            </p>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fast Simulation Login</p>
              <div className="mt-3 space-y-1.5 text-xs text-slate-300 font-mono">
                <p>Passenger: <span className="text-secondary font-bold">user@ucab.com</span> / user123</p>
                <p>Admin: <span className="text-secondary font-bold">admin@ucab.com</span> / adminpassword123</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
