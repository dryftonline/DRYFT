'use client';

import { useEffect, useState } from 'react';
import { 
  Search, 
  Plus, 
  UserCircle2,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  Edit2,
  Trash2,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function StaffManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [franchises, setFranchises] = useState<any[]>([]);

  useEffect(() => {
    fetchStaff();
    fetchFranchises();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/staff');
      const data = await res.json();
      if (res.ok) setStaff(data);
    } catch (error) {
      toast.error('Failed to load staff');
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

  const handleDeleteStaff = async (id: number) => {
    if (!confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Staff deleted successfully');
        fetchStaff();
      } else {
        toast.error('Failed to delete staff');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const markAttendance = async (staffId: number, status: string) => {
    try {
      const res = await fetch('/api/staff/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, overrideStatus: status })
      });
      if (res.ok) {
        toast.success(`Attendance marked as ${status}`);
        fetchStaff();
      } else {
        toast.error('Failed to mark attendance');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Staff Management</h1>
          <p className="text-white/40 text-sm">Manage staff attendance and track their work performance.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or role..." 
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Staff Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Staff Details</th>
                <th className="px-6 py-4 font-semibold">Role / Branch</th>
                 <th className="px-6 py-4 font-semibold">Jobs Done</th>
                <th className="px-6 py-4 font-semibold">Total Revenue (₹)</th>
                <th className="px-6 py-4 font-semibold">Today's Attendance</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {staff.filter(s => 
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                s.role.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((member) => {
                const todayAttendance = member.attendances?.[0]?.status;

                return (
                  <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                          <UserCircle2 size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{member.name}</p>
                          <p className="text-xs text-white/40">{member.phone || 'No phone'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-white">{member.role}</span>
                      <p className="text-xs text-white/40 mt-1">{member.franchise?.name || 'Main Branch'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-bold">
                        {member.jobsDoneCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-emerald-400">
                        ₹{member.totalWorth || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {todayAttendance === 'present' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase w-fit">
                            <CheckCircle2 size={12} /> Present
                          </span>
                        ) : todayAttendance === 'absent' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase w-fit">
                            <XCircle size={12} /> Absent
                          </span>
                        ) : todayAttendance === 'late' ? (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase w-fit">
                              <Clock size={12} /> Late
                            </span>
                            {member.attendances?.[0]?.minutesLate > 0 && (
                              <span className="text-[10px] text-orange-400">
                                {member.attendances[0].minutesLate} mins late (Fine: ₹{member.attendances[0].fineAmount})
                              </span>
                            )}
                          </div>
                        ) : todayAttendance === 'half-day' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase w-fit">
                            <Clock size={12} /> Half Day
                          </span>
                        ) : (
                          <div className="flex gap-1">
                            <button onClick={() => markAttendance(member.id, 'present')} className="px-2 py-1 text-[10px] font-bold rounded bg-white/5 hover:bg-emerald-500/20 text-white/60 hover:text-emerald-500 transition-colors">P</button>
                            <button onClick={() => markAttendance(member.id, 'absent')} className="px-2 py-1 text-[10px] font-bold rounded bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-500 transition-colors">A</button>
                            <button onClick={() => markAttendance(member.id, 'late')} className="px-2 py-1 text-[10px] font-bold rounded bg-white/5 hover:bg-orange-500/20 text-white/60 hover:text-orange-500 transition-colors">L</button>
                            <button onClick={() => markAttendance(member.id, 'half-day')} className="px-2 py-1 text-[10px] font-bold rounded bg-white/5 hover:bg-amber-500/20 text-white/60 hover:text-amber-500 transition-colors">H</button>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          {member.attendances?.[0]?.photoData && (
                            <a href={member.attendances[0].photoData} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 text-blue-400 text-[10px] hover:bg-white/10 transition-colors">
                              <ExternalLink size={10} /> View Photo
                            </a>
                          )}
                          {member.attendances?.[0]?.latitude && (
                            <a 
                              href={`https://maps.google.com/?q=${member.attendances[0].latitude},${member.attendances[0].longitude}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                            >
                              <MapPin size={10} /> Verified Location
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditingStaff(member)}
                          className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteStaff(member.id)}
                          className="p-2 hover:bg-rose-500/10 rounded-lg text-white/60 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {staff.length === 0 && !loading && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-white/20">
                <UserCircle2 size={32} />
              </div>
              <p className="text-white/40">No staff members found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Edit Staff Details</h2>
              <button onClick={() => setEditingStaff(null)} className="text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              if (isSubmitting) return;
              setIsSubmitting(true);
              
              const formData = new FormData(e.currentTarget);
              const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                role: formData.get('role'),
                franchiseId: formData.get('franchiseId'),
              };

              try {
                const res = await fetch(`/api/staff/${editingStaff.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data)
                });
                if (res.ok) {
                  toast.success('Staff details updated!');
                  setEditingStaff(null);
                  fetchStaff();
                } else throw new Error();
              } catch (error) {
                toast.error('Failed to update staff');
              } finally {
                setIsSubmitting(false);
              }
            }}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Full Name</label>
                  <input type="text" name="name" className="input-field" defaultValue={editingStaff.name} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Phone Number</label>
                  <input type="text" name="phone" className="input-field" defaultValue={editingStaff.phone} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Role</label>
                    <select name="role" className="input-field bg-dryft-dark" defaultValue={editingStaff.role}>
                      <option value="Washer">Washer</option>
                      <option value="Detailer">Detailer</option>
                      <option value="Cleaner">Cleaner</option>
                      <option value="Supervisor">Supervisor</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Branch</label>
                    <select name="franchiseId" className="input-field bg-dryft-dark" defaultValue={editingStaff.franchiseId}>
                      {franchises.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setEditingStaff(null)} disabled={isSubmitting} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary py-3 disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
