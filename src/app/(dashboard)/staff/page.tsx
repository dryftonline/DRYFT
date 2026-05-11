'use client';

import { useEffect, useState } from 'react';
import { 
  Search, 
  Plus, 
  UserCircle2,
  CheckCircle2,
  XCircle,
  Clock,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function StaffManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStaff();
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
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Add New Staff</span>
        </button>
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
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase w-fit">
                            <Clock size={12} /> Late
                          </span>
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
                        {member.attendances?.[0]?.photoData && (
                          <a href={member.attendances[0].photoData} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:underline">
                            View Photo
                          </a>
                        )}
                        {member.attendances?.[0]?.latitude && (
                          <a href={`https://maps.google.com/?q=${member.attendances[0].latitude},${member.attendances[0].longitude}`} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:underline">
                            View Location
                          </a>
                        )}
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

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New Staff</h2>
              <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              if (isSubmitting) return;
              setIsSubmitting(true);
              
              const form = e.currentTarget as HTMLFormElement;
              const name = (form.elements.namedItem('name') as HTMLInputElement).value;
              const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
              const role = (form.elements.namedItem('role') as HTMLSelectElement).value;

              try {
                const res = await fetch('/api/staff', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name, phone, role, franchiseId: 1 }) // Using 1 as fallback default
                });
                if (res.ok) {
                  toast.success('Staff added successfully!');
                  setShowAddModal(false);
                  fetchStaff();
                } else throw new Error();
              } catch (error) {
                toast.error('Failed to add staff');
              } finally {
                setIsSubmitting(false);
              }
            }}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Full Name</label>
                  <input type="text" name="name" className="input-field" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Phone Number</label>
                  <input type="text" name="phone" className="input-field" placeholder="+1..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Role</label>
                  <select name="role" className="input-field bg-dryft-dark">
                    <option value="Washer">Washer</option>
                    <option value="Detailer">Detailer</option>
                    <option value="Cleaner">Cleaner</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} disabled={isSubmitting} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary py-3 disabled:opacity-50">
                  {isSubmitting ? 'Adding...' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
