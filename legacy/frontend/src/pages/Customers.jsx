import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit2, 
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Mock Data
  const [customers, setCustomers] = useState([
    { id: 1, name: 'John Doe', phone: '+1 234-567-8901', car: 'Tesla Model 3', plate: 'DRYFT-001', branch: 'Downtown', status: 'completed', date: '2024-04-24 10:30 AM' },
    { id: 2, name: 'Jane Smith', phone: '+1 987-654-3210', car: 'BMW X5', plate: 'WASH-777', branch: 'Uptown', status: 'pending', date: '2024-04-24 11:15 AM' },
    { id: 3, name: 'Mike Ross', phone: '+1 555-010-9988', car: 'Audi Q7', plate: 'SNEAK-01', branch: 'Westside', status: 'completed', date: '2024-04-23 02:45 PM' },
    { id: 4, name: 'Harvey Specter', phone: '+1 444-222-3333', car: 'Mercedes S-Class', plate: 'SUITS-1', branch: 'Downtown', status: 'pending', date: '2024-04-23 04:20 PM' },
  ]);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this customer record?')) {
      setCustomers(customers.filter(c => c.id !== id));
      toast.success('Customer record deleted');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Customer Management</h1>
          <p className="text-white/40 text-sm">View and manage car wash customer data across all branches.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, phone or plate..." 
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white flex items-center gap-2">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Customer & Car</th>
                <th className="px-6 py-4 font-semibold">Plate Number</th>
                <th className="px-6 py-4 font-semibold">Branch</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers.filter(c => 
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                c.plate.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((customer) => (
                <tr key={customer.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                        <ImageIcon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{customer.name}</p>
                        <p className="text-xs text-white/40">{customer.car}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono bg-white/5 px-2 py-1 rounded border border-white/10">
                      {customer.plate}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">{customer.branch}</td>
                  <td className="px-6 py-4 text-xs text-white/40">{customer.date}</td>
                  <td className="px-6 py-4">
                    {customer.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">
                        <CheckCircle2 size={10} /> Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase">
                        <Clock size={10} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white"><Eye size={16} /></button>
                      <button className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white"><Edit2 size={16} /></button>
                      <button 
                        onClick={() => handleDelete(customer.id)}
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
        {customers.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-white/20">
              <Search size={32} />
            </div>
            <p className="text-white/40">No customers found</p>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New Customer Upload</h2>
              <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              toast.success('Customer upload successful!');
              setShowAddModal(false);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Customer Name</label>
                  <input type="text" className="input-field" placeholder="Full Name" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Phone Number</label>
                  <input type="text" className="input-field" placeholder="+1..." required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Car Model</label>
                  <input type="text" className="input-field" placeholder="e.g. Toyota Camry" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Registration Number</label>
                  <input type="text" className="input-field" placeholder="Plate Number" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Franchise Branch</label>
                  <select className="input-field bg-dryft-dark">
                    <option>Downtown</option>
                    <option>Uptown</option>
                    <option>Westside</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Car Status</label>
                  <select className="input-field bg-dryft-dark">
                    <option>Pending</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Car Photo</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-dryft-beige/50 transition-colors cursor-pointer group">
                  <ImageIcon size={32} className="mx-auto mb-3 text-white/20 group-hover:text-dryft-beige" />
                  <p className="text-sm text-white/40 group-hover:text-white">Click to upload or drag and drop car photo</p>
                  <p className="text-xs text-white/20 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Notes</label>
                <textarea className="input-field min-h-[100px]" placeholder="Add any specific car wash notes here..."></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary py-3">
                  Upload Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
