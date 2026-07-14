import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone, MapPin, Upload, ArrowRight, ArrowLeft } from 'lucide-react';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('user');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 2-step wizard flow

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!name || !email || !password) {
        return toast.error('Please enter name, email, and password');
      }
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error('Name, email, and password are required');
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phone', phone);
      formData.append('address', address);
      formData.append('role', role);
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      const res = await userAPI.register(formData);
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
        {/* Left Side: Step Wizard Form */}
        <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
          <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            
            {/* Header info */}
            <div className="text-left">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
              <p className="mt-2 text-xs text-slate-500">
                Already registered?{' '}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Stepper Progress bar */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 1 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  1
                </span>
                <span className="text-xs font-semibold text-slate-650">Credentials</span>
              </div>
              <div className="h-0.5 w-12 bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 2 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  2
                </span>
                <span className="text-xs font-semibold text-slate-650">Profile Specs</span>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Step 1 Fields */}
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  
                  {/* Account Type */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Join UCab As</label>
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
                        Passenger
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

                  {/* Name */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-xs focus:border-primary focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-xs focus:border-primary focus:outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-xs focus:border-primary focus:outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark transition mt-6"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>

                </div>
              )}

              {/* Step 2 Fields */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  
                  {/* Upload Profile image */}
                  <div className="flex flex-col items-center justify-center gap-3">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="h-20 w-20 rounded-full border-2 border-primary object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <User className="h-10 w-10" />
                      </div>
                    )}
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-350 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition">
                      <Upload className="h-3.5 w-3.5" />
                      Upload Photo
                      <input
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-xs focus:border-primary focus:outline-none"
                        placeholder="+91 99999-99999"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Address Location</label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-xs focus:border-primary focus:outline-none"
                        placeholder="Noida Sectors, Delhi"
                      />
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center justify-center gap-1 rounded-xl border border-slate-300 py-3 text-xs font-bold text-slate-650 hover:bg-slate-50 transition"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="col-span-2 flex justify-center items-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-50 transition shadow-lg shadow-primary/20"
                    >
                      {loading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </div>

                </div>
              )}

            </form>

          </div>
        </div>

        {/* Right Side: Animated Decorative Graphic Panel */}
        <div className="hidden lg:flex flex-col justify-center bg-darkbg bg-gradient-primary animate-gradient p-16 text-white text-left relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-20 right-10 h-32 w-32 rounded-full bg-cyan-400 blur-3xl animate-float"></div>
            <div className="absolute bottom-20 left-10 h-44 w-44 rounded-full bg-pink-400 blur-3xl animate-float" style={{ animationDelay: '2.5s' }}></div>
          </div>

          <div className="max-w-md relative z-10 space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold tracking-wider text-secondary uppercase border border-white/10 backdrop-blur-md">
              Secure Transport Portal
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight">Access Modern Commutes</h1>
            <p className="text-sm font-light leading-relaxed text-slate-200">
              Join thousands of Delhi NCR passengers. Estimate cab routes instantly, request checkout authorizations, and track drivers in real-time.
            </p>

            <div className="flex gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-xl font-black text-secondary">500+</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Cabs Ready</p>
              </div>
              <div className="border-l border-white/10 pl-4">
                <p className="text-xl font-black text-accent">100%</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Simulated Payments</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
