import { useState } from 'react';
import { UserCog, Plus, Shield, ShieldCheck, Mail, Key, Edit, Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function UserManagement() {
  const [users] = useState([
    { id: 1, name: 'Admin User', role: 'Super Admin', branch: 'All', status: 'active' },
    { id: 2, name: 'John Manager', role: 'Franchise Manager', branch: 'Downtown', status: 'active' },
    { id: 3, name: 'Sarah Staff', role: 'Staff', branch: 'Uptown', status: 'inactive' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">System Users</h1>
          <p className="text-white/40 text-sm">Manage administrative access and permissions across the platform.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>Create User</span>
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
              <th className="px-6 py-4">User Details</th>
              <th className="px-6 py-4">Access Level</th>
              <th className="px-6 py-4">Branch</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                      {u.name[0]}
                    </div>
                    <span className="text-sm font-medium text-white">{u.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                    u.role === 'Super Admin' ? 'text-dryft-beige' : 'text-white/60'
                  }`}>
                    <Shield size={14} /> {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-white/40">{u.branch}</td>
                <td className="px-6 py-4">
                  {u.status === 'active' ? (
                    <span className="text-emerald-500 text-xs flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  ) : (
                    <span className="text-white/20 text-xs flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" /> Disabled
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
                      <Key size={16} />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-rose-500 transition-colors">
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-8 glass-panel border-dashed border-white/5 text-center">
        <h3 className="font-bold text-white mb-2">Role Permissions Matrix</h3>
        <p className="text-sm text-white/40 max-w-lg mx-auto mb-6">
          Define modular access for each role. Changes here will instantly affect all users assigned to that role.
        </p>
        <button className="text-xs font-semibold px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
          Manage Permissions Configuration
        </button>
      </div>
    </div>
  );
}
