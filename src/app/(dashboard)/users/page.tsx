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
  EyeOff
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [franchises, setFranchises] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState<'system' | 'staff'>('system');

  useEffect(() => {
    fetchUsers();
    fetchFranchises();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchFranchises = async () => {
    try {
      const res = await fetch('/api/franchises');
      const data = await res.json();
      if (res.ok) setFranchises(data);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-white/40 text-sm">Manage system administrators, managers, and franchise operators.</p>
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
        <div className="glass-panel p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
            <UserIcon size={20} />
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Total Users</p>
            <p className="text-xl font-bold text-white">{users.length}</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Active Admins</p>
            <p className="text-xl font-bold text-white">{users.filter(u => u.status === 'active').length}</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Pending Invites</p>
            <p className="text-xl font-bold text-white">2</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text" 
            placeholder="Search by username or email..." 
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white flex items-center gap-2">
            <Filter size={18} />
            <span>Role: All</span>
          </button>
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
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Last Login</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.filter(u => 
                u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dryft-beige/20 to-dryft-beige/5 flex items-center justify-center text-dryft-beige font-bold border border-white/10">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.username}</p>
                        <p className="text-xs text-white/40">{user.email}</p>
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
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(user.id, user.status)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors",
                        user.status === 'active' 
                          ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" 
                          : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                      )}
                    >
                      <div className={cn("w-1.5 h-1.5 rounded-full", user.status === 'active' ? "bg-emerald-500" : "bg-rose-500")} />
                      {user.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-xs text-white/40">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4 text-right">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              toast.success('User updated successfully!');
              setEditingUser(null);
            }}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input type="text" className="input-field pl-10" defaultValue={editingUser.username} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input type="email" className="input-field pl-10" defaultValue={editingUser.email} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Role</label>
                    <select className="input-field bg-dryft-dark" defaultValue={editingUser.role}>
                      <option>Operator</option>
                      <option>Manager</option>
                      <option>Super Admin</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Franchise</label>
                    <select className="input-field bg-dryft-dark" defaultValue={editingUser.franchise}>
                      <option>Downtown</option>
                      <option>Uptown</option>
                      <option>Westside</option>
                      <option>All Access</option>
                    </select>
                  </div>
                </div>
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
