'use client';

import { useEffect, useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  UserPlus, 
  Edit2, 
  Trash2,
  Shield,
  User as UserIcon,
  Mail,
  MoreVertical,
  CheckCircle2,
  XCircle,
  X,
  Eye,
  EyeOff,
  Clock,
  Key,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'active' | 'inactive' | 'rejected'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [franchises, setFranchises] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState<'system' | 'staff'>('system');
  const [showEditPassword, setShowEditPassword] = useState(false);
  
  // Track password visibility per user ID
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchUsers();
    fetchFranchises();

    // Auto refresh users every 5 seconds so new employee signups show up live
    const interval = setInterval(() => {
      fetchUsers(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch('/api/users');
      const data = await res.json();
      if (res.ok) setUsers(data || []);
    } catch (error) {
      if (!silent) toast.error('Failed to load users');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchFranchises = async () => {
    try {
      const res = await fetch('/api/franchises');
      const data = await res.json();
      if (res.ok) setFranchises(data || []);
    } catch (error) {}
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setUsers(users.filter(u => u.id !== id));
          toast.success('User deleted successfully');
        } else {
          const data = await res.json();
          toast.error(data.error || 'Failed to delete');
        }
      } catch (error) {
        toast.error('An error occurred');
      }
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
        toast.success(`User is now ${newStatus}`);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleApproval = async (id: number, newStatus: 'active' | 'rejected') => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
        if (newStatus === 'active') {
          toast.success('User registration approved! They can now log in.');
        } else {
          toast.error('User registration request rejected.');
        }
      } else {
        toast.error('Failed to update user request');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const togglePasswordVisibility = (id: number) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter users by search term and tab selection
  const pendingUsers = users.filter(u => u.status === 'pending');

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.staff?.name && u.staff.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'pending') return u.status === 'pending';
    if (statusFilter === 'active') return u.status === 'active';
    if (statusFilter === 'inactive') return u.status === 'inactive' || u.status === 'rejected';
    
    return true; // 'all'
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            User Management
            <button 
              onClick={() => fetchUsers(false)} 
              className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
              title="Refresh Users List"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </h1>
          <p className="text-white/40 text-sm">Manage system administrators, staff registrations, and approval requests.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus size={18} />
          <span>Create New User</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => setStatusFilter('all')}
          className={`glass-panel p-4 flex items-center gap-4 cursor-pointer transition-all ${statusFilter === 'all' ? 'border-dryft-beige' : 'hover:border-white/20'}`}
        >
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
            <UserIcon size={20} />
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Total Accounts</p>
            <p className="text-xl font-bold text-white">{users.length}</p>
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('active')}
          className={`glass-panel p-4 flex items-center gap-4 cursor-pointer transition-all ${statusFilter === 'active' ? 'border-emerald-500' : 'hover:border-white/20'}`}
        >
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Active Users</p>
            <p className="text-xl font-bold text-white">{users.filter(u => u.status === 'active').length}</p>
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('pending')}
          className={`glass-panel p-4 flex items-center gap-4 cursor-pointer transition-all ${statusFilter === 'pending' ? 'border-amber-500' : 'hover:border-white/20'}`}
        >
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 relative">
            <Clock size={20} />
            {pendingUsers.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Pending Signup Requests</p>
            <p className="text-xl font-bold text-amber-400">{pendingUsers.length}</p>
          </div>
        </div>
      </div>

      {/* Pending Signup Requests Banner Card */}
      {pendingUsers.length > 0 && (
        <div className="glass-panel p-6 border-amber-500/40 bg-amber-500/[0.03] shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Clock className="text-amber-400 animate-pulse" size={22} />
              <h2 className="text-lg font-bold text-white">Pending Employee Registration Requests</h2>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-500/30">
                {pendingUsers.length} Action Needed
              </span>
            </div>
            <span className="text-xs text-white/40 italic">New employee signups requiring approval</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingUsers.map((pUser) => (
              <div key={pUser.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/50 transition-all flex flex-col justify-between gap-4 shadow-lg">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center border border-amber-500/30">
                      {pUser.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{pUser.username}</p>
                      <p className="text-xs text-white/50">{pUser.staff?.name || pUser.email || 'Employee Signup'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {pUser.role?.name || 'Operator'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-white/60 bg-black/40 p-3 rounded-lg border border-white/5">
                  <div className="flex justify-between items-center">
                    <span>Branch:</span>
                    <span className="font-semibold text-white">{pUser.franchise?.name || 'All Branches'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><Key size={12} className="text-amber-400" /> Password:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400 font-bold">
                        {visiblePasswords[pUser.id] ? (pUser.plainPassword || 'N/A') : '••••••••'}
                      </span>
                      <button 
                        onClick={() => togglePasswordVisibility(pUser.id)}
                        className="text-white/40 hover:text-white transition-colors"
                        title={visiblePasswords[pUser.id] ? "Hide Password" : "View Password"}
                      >
                        {visiblePasswords[pUser.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproval(pUser.id, 'active')}
                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-lg"
                  >
                    <CheckCircle2 size={14} />
                    <span>Accept Request</span>
                  </button>
                  <button
                    onClick={() => handleApproval(pUser.id, 'rejected')}
                    className="flex-1 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-rose-500/30"
                  >
                    <XCircle size={14} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters, Status Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Status Filter Tabs */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
          {[
            { id: 'all', label: 'All Users', count: users.length },
            { id: 'pending', label: 'Pending Requests', count: pendingUsers.length, color: 'text-amber-400' },
            { id: 'active', label: 'Active Users', count: users.filter(u => u.status === 'active').length },
            { id: 'inactive', label: 'Inactive / Rejected', count: users.filter(u => u.status === 'inactive' || u.status === 'rejected').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                statusFilter === tab.id 
                  ? 'bg-dryft-beige text-dryft-dark shadow-md' 
                  : 'text-white/40 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilter === tab.id ? 'bg-dryft-dark text-dryft-beige' : 'bg-white/10 text-white/60'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text" 
            placeholder="Search by username, email or name..." 
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Franchise</th>
                <th className="px-6 py-4 font-semibold">Credentials (Password)</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Created Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${
                        user.status === 'pending' 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                          : 'bg-gradient-to-br from-dryft-beige/20 to-dryft-beige/5 text-dryft-beige border-white/10'
                      }`}>
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white flex items-center gap-2">
                          {user.username}
                          {user.status === 'pending' && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold uppercase">
                              New Request
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-white/40">{user.staff?.name || user.email || 'System User'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-bold uppercase px-2 py-1 rounded-md border",
                      user.role?.name === 'Super Admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      user.role?.name === 'Manager' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    )}>
                      {user.role?.name || 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">{user.franchise?.name || 'All Access'}</td>
                  
                  {/* Password Reveal Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-emerald-400 font-bold">
                        {visiblePasswords[user.id] ? (user.plainPassword || 'N/A') : '••••••••'}
                      </span>
                      <button 
                        onClick={() => togglePasswordVisibility(user.id)}
                        className="text-white/40 hover:text-white transition-colors"
                        title={visiblePasswords[user.id] ? "Hide Password" : "View Password"}
                      >
                        {visiblePasswords[user.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {user.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Clock size={12} /> Pending Approval
                      </span>
                    ) : (
                      <button 
                        onClick={() => toggleStatus(user.id, user.status)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors",
                          user.status === 'active' 
                            ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" 
                            : user.status === 'rejected'
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                        )}
                      >
                        <div className={cn("w-1.5 h-1.5 rounded-full", user.status === 'active' ? "bg-emerald-500" : "bg-rose-500")} />
                        {user.status}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-white/40">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                  
                  <td className="px-6 py-4 text-right">
                    {user.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApproval(user.id, 'active')}
                          className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 size={14} /> Accept
                        </button>
                        <button
                          onClick={() => handleApproval(user.id, 'rejected')}
                          className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border border-rose-500/30"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-white/60 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && !loading && (
            <div className="py-16 text-center">
              <UserIcon className="mx-auto text-white/20 mb-3" size={36} />
              <p className="text-white/40 text-sm">No users found matching your filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Create New User</h2>
              <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              const password = formData.get('password') as string;
              const confirmPassword = formData.get('confirmPassword') as string;

              if (password !== confirmPassword) {
                toast.error('Passwords do not match');
                return;
              }

              const modules = formData.getAll('modules') as string[];
              const data = {
                username: formData.get('username'),
                email: formData.get('email') || `${formData.get('username')}@dryft.com`,
                password: password,
                roleName: formData.get('roleName'),
                franchiseId: formData.get('franchiseId'),
                phone: formData.get('phone'),
                fullName: formData.get('fullName'),
                accessibleModules: modules.length > 0 ? modules : (accountType === 'staff' ? ['Staff Portal'] : ['*']),
              };

              try {
                const res = await fetch('/api/users', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data),
                });
                if (res.ok) {
                  toast.success(accountType === 'staff' ? 'Staff member created with login credentials!' : 'User account created successfully!');
                  setShowAddModal(false);
                  fetchUsers();
                } else {
                  const error = await res.json();
                  toast.error(error.error || 'Failed to create account');
                }
              } catch (error) {
                toast.error('An error occurred');
              }
            }}>
              <div className="space-y-4">
                {/* Account Type Toggle */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mb-6">
                  <button
                    type="button"
                    onClick={() => setAccountType('system')}
                    className={cn(
                      "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                      accountType === 'system' ? "bg-dryft-beige text-dryft-dark shadow-lg" : "text-white/40 hover:text-white"
                    )}
                  >
                    System User
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('staff')}
                    className={cn(
                      "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                      accountType === 'staff' ? "bg-dryft-beige text-dryft-dark shadow-lg" : "text-white/40 hover:text-white"
                    )}
                  >
                    Staff Member
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">
                      {accountType === 'system' ? 'Full Name' : 'Staff Full Name'}
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input type="text" name="fullName" className="input-field pl-10" placeholder="John Doe" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Login Username</label>
                    <input type="text" name="username" className="input-field" placeholder="johndoe" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">
                      {accountType === 'system' ? 'Email Address' : 'Staff Phone Number'}
                    </label>
                    <div className="relative">
                      {accountType === 'system' ? (
                        <>
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                          <input type="email" name="email" className="input-field pl-10" placeholder="john@dryft.com" required />
                        </>
                      ) : (
                        <input type="text" name="phone" className="input-field" placeholder="+91..." required />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Role</label>
                    <select name="roleName" className="input-field bg-dryft-dark">
                      {accountType === 'system' ? (
                        <>
                          <option>Operator</option>
                          <option>Manager</option>
                          <option>Super Admin</option>
                        </>
                      ) : (
                        <>
                          <option value="Washer">Washer</option>
                          <option value="Detailer">Detailer</option>
                          <option value="Cleaner">Cleaner</option>
                          <option value="Supervisor">Supervisor</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Login Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        className="input-field pr-10" 
                        placeholder="••••••••" 
                        required 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white p-1 rounded-md hover:bg-black/80 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Confirm Password</label>
                    <div className="relative">
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        name="confirmPassword" 
                        className="input-field pr-10" 
                        placeholder="••••••••" 
                        required 
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white p-1 rounded-md hover:bg-black/80 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Franchise / Branch</label>
                  <select name="franchiseId" className="input-field bg-dryft-dark" required>
                    <option value="">Select Franchise</option>
                    {franchises.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                {accountType === 'system' && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <label className="text-sm font-medium text-white/60">Accessible Modules</label>
                    <p className="text-[10px] text-white/40 mb-2">Select which pages this user can view. Leave all unchecked for full access.</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        'Customers', 'Franchises', 'Stock Updates', 
                        'Staff Management', 'Notifications', 'System Users', 
                        'Reports', 'Settings'
                      ].map(module => (
                        <label key={module} className="flex items-center gap-2 text-sm text-white/80 cursor-pointer p-2 hover:bg-white/5 rounded-md">
                          <input type="checkbox" name="modules" value={module} className="rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500" />
                          {module}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary py-3">
                  {accountType === 'system' ? 'Create Account' : 'Create Staff Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Edit User: {editingUser.username}</h2>
              <button onClick={() => setEditingUser(null)} className="text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const password = formData.get('password') as string;
              const username = formData.get('username') as string;
              const roleName = formData.get('roleName') as string;
              const franchiseId = formData.get('franchiseId') as string;
              
              const fullName = formData.get('fullName') as string;
              const phone = formData.get('phone') as string;
              
              const modules = formData.getAll('modules') as string[];
              const isStaffRole = ['Washer', 'Detailer', 'Cleaner', 'Supervisor'].includes(roleName || editingUser.role?.name);
              
              const data: any = {
                username,
                roleName,
                franchiseId: franchiseId || null,
                accessibleModules: modules.length > 0 ? modules : (isStaffRole ? ['Staff Portal'] : ['*']),
              };

              if (password) {
                data.password = password;
              }

              if (editingUser.staffId) {
                data.fullName = fullName;
                data.phone = phone;
              }

              try {
                const res = await fetch(`/api/users/${editingUser.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data),
                });
                if (res.ok) {
                  toast.success('User updated successfully!');
                  setEditingUser(null);
                  fetchUsers();
                } else {
                  const error = await res.json();
                  toast.error(error.error || 'Failed to update user');
                }
              } catch (error) {
                toast.error('An error occurred');
              }
            }}>
              <div className="space-y-4">
                {editingUser.staffId ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">Staff Full Name</label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                          <input type="text" name="fullName" className="input-field pl-10" defaultValue={editingUser.staff?.name || ''} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">Login Username</label>
                        <input type="text" name="username" className="input-field" defaultValue={editingUser.username} required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/60">Staff Phone Number</label>
                      <input type="text" name="phone" className="input-field" defaultValue={editingUser.staff?.phone || ''} placeholder="+91..." required />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Login Username</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input type="text" name="username" className="input-field pl-10" defaultValue={editingUser.username} required />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Role</label>
                    <select name="roleName" className="input-field bg-dryft-dark text-white border-white/10" defaultValue={editingUser.role?.name || 'Operator'}>
                      <option value="Operator">Operator</option>
                      <option value="Manager">Manager</option>
                      <option value="Super Admin">Super Admin</option>
                      <option value="Washer">Washer</option>
                      <option value="Detailer">Detailer</option>
                      <option value="Cleaner">Cleaner</option>
                      <option value="Supervisor">Supervisor</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Franchise / Branch</label>
                    <select name="franchiseId" className="input-field bg-dryft-dark text-white border-white/10" defaultValue={editingUser.franchiseId || ''}>
                      <option value="">All Access</option>
                      {franchises.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Password</label>
                  <div className="relative">
                    <input 
                      type={showEditPassword ? "text" : "password"} 
                      name="password" 
                      className="input-field pr-10" 
                      defaultValue={editingUser.plainPassword || ''} 
                      placeholder="••••••••" 
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white p-1 rounded-md hover:bg-black/80 transition-colors"
                    >
                      {showEditPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {editingUser.role?.name !== 'Washer' && editingUser.role?.name !== 'Detailer' && editingUser.role?.name !== 'Cleaner' && editingUser.role?.name !== 'Supervisor' && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <label className="text-sm font-medium text-white/60">Accessible Modules</label>
                    <p className="text-[10px] text-white/40 mb-2">Select which pages this user can view. Leave all unchecked for full access.</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        'Customers', 'Franchises', 'Stock Updates', 
                        'Staff Management', 'Notifications', 'System Users', 
                        'Reports', 'Settings'
                      ].map(module => (
                        <label key={module} className="flex items-center gap-2 text-sm text-white/80 cursor-pointer p-2 hover:bg-white/5 rounded-md">
                          <input 
                            type="checkbox" 
                            name="modules" 
                            value={module} 
                            defaultChecked={editingUser.accessibleModules?.includes(module)}
                            className="rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500" 
                          />
                          {module}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary py-3">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper for conditional classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
