import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Mail, Lock, ShieldAlert } from 'lucide-react';

const Alogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please enter admin credentials');
    }

    setLoading(true);
    try {
      const res = await adminAPI.login({ email, password });
      login(res.data, res.data.token);
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-white">
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-950/40">
        <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-2xl">
          <div className="text-center space-y-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500 text-slate-950">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Admin Portal</h2>
            <p className="text-sm text-slate-400">
              Sign in with administrative privileges or{' '}
              <Link to="/admin/register" className="font-semibold text-yellow-500 hover:text-yellow-450">
                Register as Admin
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm text-left">
              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Admin Email Address</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-650">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-3 text-sm focus:border-yellow-500 focus:outline-none"
                    placeholder="admin@ucab.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-650">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-3 text-sm focus:border-yellow-500 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center items-center gap-2 rounded-xl bg-yellow-500 py-3 text-base font-bold text-slate-950 hover:bg-yellow-400 disabled:opacity-50 transition shadow-lg shadow-yellow-500/10"
            >
              {loading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-950 border-t-transparent"></div>
              ) : (
                'Authorize Portal Entry'
              )}
            </button>
          </form>

          <div className="text-center">
            <Link to="/login" className="text-xs text-slate-500 hover:text-slate-400">
              Return to Passenger Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alogin;
