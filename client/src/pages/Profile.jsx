import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Upload, Lock, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const { user, updateUserInfo } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [password, setPassword] = useState('');
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    user?.profileImage
      ? user.profileImage.startsWith('/') ? `http://localhost:8000${user.profileImage}` : user.profileImage
      : ''
  );
  
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      return toast.error('Name and email are required');
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('address', address);
      if (password) {
        formData.append('password', password);
      }
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      const res = await userAPI.updateProfile(formData);
      updateUserInfo(res.data);
      setPassword(''); // clear password field
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Update profile failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-slate-900 text-left tracking-tight mb-8">Account Profile</h1>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleUpdateProfile} className="space-y-6 text-left">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Avatar"
                  className="h-24 w-24 rounded-full border-4 border-yellow-500 object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <User className="h-12 w-12" />
                </div>
              )}
              
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-350 bg-slate-50 hover:bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition">
                <Upload className="h-3.5 w-3.5" />
                Upload New Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-yellow-500 focus:outline-none bg-slate-50 text-slate-500"
                    disabled
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Phone Number</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-yellow-500 focus:outline-none"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Update Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-yellow-500 focus:outline-none"
                    placeholder="Enter new password (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Home Address</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-yellow-500 focus:outline-none"
                  placeholder="Enter full street address"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-50/50 p-4 text-xs text-yellow-800 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-yellow-600 shrink-0" />
              <span>Role: <strong className="uppercase">{user?.role}</strong> Account (Creation date: {new Date(user?.createdAt).toLocaleDateString()})</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center rounded-xl bg-yellow-500 py-3 text-sm font-bold text-slate-950 hover:bg-yellow-400 disabled:opacity-50 transition shadow-lg shadow-yellow-500/10"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent"></div>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
