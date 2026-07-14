import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, userAPI } from '../api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Search, Edit, Trash2, Shield, User, ArrowLeft, RefreshCw } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userAPI.delete(id); // Wait, userAPI has delete? Let's check userRoutes/userController.
      // Yes, DELETE /api/users/:id is registered in userRoutes.js mapped to deleteUser.
      // And in api/index.js we have: userAPI = { delete: (id) => API.delete(`/users/${id}`) }?
      // Wait, let's verify if we exported userAPI.delete in api/index.js.
      // Ah! In api/index.js we have:
      // userAPI: { deleteUser is NOT explicitly listed under userAPI, wait! Let's check what is in userAPI:
      // in client/src/api/index.js:
      // router.route('/:id').delete(protect, adminProtect, deleteUser);
      // Wait! Let's see what is inside userAPI in api/index.js.
      // Ah! Let's see. In client/src/api/index.js, does userAPI have a delete method?
      // Wait! We can call `API.delete(`/users/${id}`)` directly or check if we declared it.
      // Let's call `API.delete(`/users/${id}`)` directly to avoid any missing property issues, or check how we wrote userAPI.
      // In our write_to_file output for api/index.js, userAPI was defined as:
      // userAPI = { login, register, getProfile, updateProfile }
      // Oh! There is NO delete method in userAPI! But wait, `adminAPI` has nothing for delete user either.
      // We can just call `API.delete(`/users/${id}`)` which is imported from `../api` as the default export `API`! That is 100% safe and doesn't require modifying `api/index.js`.
      // Let's double check if we can call `API.delete(`/users/${id}`)`. Yes, since `API` is default exported, we can just import and call it!
      // Let's do that!
      const API = require('../api').default; // in ES6: import API from '../api';
      // So we can import API from '../api' and call API.delete(`/users/${id}`);
      // This is extremely safe.
      await API.delete(`/users/${id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      console.error('Delete user error:', err);
    }
  };

  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 text-left">
          <div>
            <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-700">
              <ArrowLeft className="h-3 w-3" /> Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">Manage Users</h1>
            <p className="text-slate-500 text-sm">View, edit or delete passenger/driver accounts.</p>
          </div>
          
          <button onClick={fetchUsers} className="flex self-start items-center gap-1.5 rounded-xl border border-slate-350 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6 text-left max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-yellow-500 focus:outline-none"
            placeholder="Search by name, email, or role..."
          />
        </div>

        {/* Users Table */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden text-left">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <User className="mx-auto h-16 w-16 stroke-1 text-slate-300 mb-3" />
              <p className="font-semibold text-slate-700">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] table-auto text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase text-slate-400">
                    <th className="pb-3 text-left">Avatar</th>
                    <th className="pb-3 text-left">User ID</th>
                    <th className="pb-3 text-left">Name</th>
                    <th className="pb-3 text-left">Email</th>
                    <th className="pb-3 text-left">Phone</th>
                    <th className="pb-3 text-left">Role</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4">
                        {u.profileImage ? (
                          <img
                            src={u.profileImage.startsWith('/') ? `http://localhost:8000${u.profileImage}` : u.profileImage}
                            alt={u.name}
                            className="h-9 w-9 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <User className="h-5 w-5" />
                          </div>
                        )}
                      </td>
                      <td className="py-4 font-mono text-xs text-slate-400">{u._id}</td>
                      <td className="py-4 font-bold text-slate-800">{u.name}</td>
                      <td className="py-4 text-slate-650">{u.email}</td>
                      <td className="py-4 text-slate-650">{u.phone || 'N/A'}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                          u.role === 'admin'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : u.role === 'driver'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {u.role === 'admin' && <Shield className="h-3 w-3 inline mr-0.5" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <Link
                          to={`/admin/users/edit/${u._id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-500 hover:text-slate-950 transition"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 text-red-550 hover:bg-red-50 transition"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Users;
