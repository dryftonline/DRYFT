import { useState } from 'react';
import { Plus, MapPin, Phone, Mail, MoreVertical, Store, ShieldCheck, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Franchises() {
  const [franchises, setFranchises] = useState([
    { id: 1, name: 'DRYFT Downtown', owner: 'Alex Johnson', location: '123 Main St, Central City', phone: '+1 555-0011', email: 'downtown@dryft.com', status: 'active', users: 5 },
    { id: 2, name: 'DRYFT Uptown', owner: 'Sarah Miller', location: '456 North Ave, Heights', phone: '+1 555-0022', email: 'uptown@dryft.com', status: 'active', users: 3 },
    { id: 3, name: 'DRYFT Westside', owner: 'Robert Wilson', location: '789 West Blvd, Suburbs', phone: '+1 555-0033', email: 'westside@dryft.com', status: 'inactive', users: 2 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Franchise Management</h1>
          <p className="text-white/40 text-sm">Manage company branches and assigned personnel.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
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
                <button className="p-1 hover:bg-white/5 rounded-md text-white/40 hover:text-white transition-colors">
                  <MoreVertical size={16} />
                </button>
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
    </div>
  );
}
