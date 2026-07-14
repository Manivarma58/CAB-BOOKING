import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, ArrowLeft, RefreshCw, Save } from 'lucide-react';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('user');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await API.get(`/users/${id}`);
        setName(res.data.name);
        setEmail(res.data.email);
        setPhone(res.data.phone || '');
        setAddress(res.data.address || '');
        setRole(res.data.role);
        if (res.data.profileImage) {
          setImagePreview(res.data.profileImage.startsWith('/') ? `http://localhost:8000${res.data.profileImage}` : res.data.profileImage);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await API.put(`/users/${id}`, {
        name,
        email,
        phone,
        address,
        role
      });
      toast.success('User updated successfully!');
      navigate('/admin/users');
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-left mb-6">
          <Link to="/admin/users" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-550 hover:text-slate-900 transition">
            <ArrowLeft className="h-4 w-4" /> Back to Users
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">Edit Account Profile</h1>
          <p className="text-slate-500 text-sm">Update passenger or driver access configurations.</p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 flex justify-center shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              {/* Profile Image View */}
              <div className="flex flex-col items-center gap-2">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={name}
                    className="h-20 w-20 rounded-full border-2 border-yellow-500 object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <User className="h-10 w-10" />
                  </div>
                )}
                <span className="text-xs text-slate-400 font-mono">ID: {id}</span>
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
                      className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-yellow-500 focus:outline-none"
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
                    />
                  </div>
                </div>

                {/* Role dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Account Access Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-yellow-500 focus:outline-none bg-white"
                  >
                    <option value="user">Passenger</option>
                    <option value="driver">Driver</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Physical Address</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-yellow-500 py-3 text-sm font-bold text-slate-950 hover:bg-yellow-400 disabled:opacity-50 transition shadow-lg shadow-yellow-500/10"
              >
                {updating ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save User Profile
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserEdit;
