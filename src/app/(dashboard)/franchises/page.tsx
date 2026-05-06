'use client';

import { useState } from 'react';
import { Plus, MapPin, Phone, Mail, MoreVertical, Store, ShieldCheck, ShieldAlert, X, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Franchises() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [franchises, setFranchises] = useState([
    { id: 1, name: 'DRYFT Downtown', owner: 'Alex Johnson', location: '123 Main St, Central City', phone: '+1 555-0011', email: 'downtown@dryft.com', status: 'active', users: 5 },
    { id: 2, name: 'DRYFT Uptown', owner: 'Sarah Miller', location: '456 North Ave, Heights', phone: '+1 555-0022', email: 'uptown@dryft.com', status: 'active', users: 3 },
    { id: 3, name: 'DRYFT Westside', owner: 'Robert Wilson', location: '789 West Blvd, Suburbs', phone: '+1 555-0033', email: 'westside@dryft.com', status: 'inactive', users: 2 },
  ]);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this franchise?')) {
      setFranchises(franchises.filter(f => f.id !== id));
      toast.success('Franchise deleted successfully');
    }
  };

  const [editingFranchise, setEditingFranchise] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Franchise Management</h1>
          <p className="text-white/40 text-sm">Manage company branches and assigned personnel.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          <span>New Franchise</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {franchises.map((f) => (
          <div key={f.id} className="glass-panel p-6 group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-dryft-beige group-hover:bg-dryft-beige group-hover:text-dryft-dark transition-all duration-300">
                <Store size={24} />
              </div>
              <div className="flex items-center gap-2">
                {f.status === 'active' ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                    <ShieldCheck size={10} /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-white/30 bg-white/5 px-2 py-1 rounded-full">
                    <ShieldAlert size={10} /> Inactive
                  </span>
                )}
                <div className="flex items-center gap-1 transition-opacity">
                  <button 
                    onClick={() => setEditingFranchise(f)}
                    className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-dryft-beige transition-colors"
                    title="Edit Franchise"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(f.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-500 transition-colors"
                    title="Delete Franchise"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{f.name}</h3>
            <p className="text-sm text-white/40 mb-4 flex items-center gap-2">
              Owner: <span className="text-white/80">{f.owner}</span>
            </p>

            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex items-start gap-3 text-sm text-white/60">
                <MapPin size={16} className="mt-0.5 text-white/20" />
                <span>{f.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Phone size={16} className="text-white/20" />
                <span>{f.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Mail size={16} className="text-white/20" />
                <span>{f.email}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="text-xs text-white/40">
                <span className="text-white font-semibold">{f.users}</span> Users Assigned
              </div>
              <button className="text-xs font-semibold text-dryft-beige hover:text-white transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Franchise Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New Franchise</h2>
              <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              toast.success('Franchise created successfully!');
              setShowAddModal(false);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Franchise Name</label>
                  <input type="text" className="input-field" placeholder="e.g. DRYFT Eastbay" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Owner Name</label>
                  <input type="text" className="input-field" placeholder="Full Name" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Phone Number</label>
                  <input type="text" className="input-field" placeholder="+1..." required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Email Address</label>
                  <input type="email" className="input-field" placeholder="branch@dryft.com" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Location / Address</label>
                <textarea className="input-field min-h-[80px]" placeholder="Full street address..." required></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary py-3">
                  Create Franchise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Franchise Modal */}
      {editingFranchise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Edit Franchise: {editingFranchise.name}</h2>
              <button onClick={() => setEditingFranchise(null)} className="text-white/40 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              toast.success('Franchise updated successfully!');
              setEditingFranchise(null);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Franchise Name</label>
                  <input type="text" className="input-field" defaultValue={editingFranchise.name} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Owner Name</label>
                  <input type="text" className="input-field" defaultValue={editingFranchise.owner} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Phone Number</label>
                  <input type="text" className="input-field" defaultValue={editingFranchise.phone} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Email Address</label>
                  <input type="email" className="input-field" defaultValue={editingFranchise.email} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Location / Address</label>
                <textarea className="input-field min-h-[80px]" defaultValue={editingFranchise.location} required></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setEditingFranchise(null)} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">
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
