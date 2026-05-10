'use client';

import { useEffect, useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
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
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // POS Pricing State
  const [selectedService, setSelectedService] = useState('exterior');
  const [vehicleType, setVehicleType] = useState('standard');
  const [selectedAddon, setSelectedAddon] = useState('');
  const [addonAmount, setAddonAmount] = useState<number | ''>('');
  const [discount, setDiscount] = useState<number | ''>('');
  const [generatedKot, setGeneratedKot] = useState('');

  let basePrice = selectedService === 'exterior' ? 250 : selectedService === 'interior_exterior' ? 500 : 0;
  let vehicleAddon = 0;
  if (selectedService === 'exterior') {
    if (vehicleType === 'suv') vehicleAddon = 50;
    if (vehicleType === 'mpv') vehicleAddon = 100;
  } else if (selectedService === 'interior_exterior') {
    if (vehicleType === 'suv') vehicleAddon = 50;
    if (vehicleType === 'mpv') vehicleAddon = 150;
  }
  const subTotal = basePrice + vehicleAddon + (Number(addonAmount) || 0);
  const finalTotal = subTotal - (subTotal * (Number(discount) || 0) / 100);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/customers');
      const data = await res.json();
      if (res.ok) setCustomers(data);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this customer record?')) {
      try {
        const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setCustomers(customers.filter(c => c.id !== id));
          toast.success('Customer record deleted permanently');
        } else {
          toast.error('Failed to delete customer');
        }
      } catch (error) {
        toast.error('An error occurred');
      }
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
          onClick={() => {
            setGeneratedKot(`KOT-${Math.floor(10000 + Math.random() * 90000)}`);
            setShowAddModal(true);
          }}
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
          <button 
            onClick={() => toast.success('Filters applied')}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white flex items-center gap-2"
          >
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
                        <p className="text-xs text-white/40">{customer.carModel}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono bg-white/5 px-2 py-1 rounded border border-white/10">
                      {customer.carRegistration}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">{customer.franchise?.name}</td>
                  <td className="px-6 py-4 text-xs text-white/40">{customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4">
                    {customer.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">
                        <CheckCircle2 size={10} /> Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase">
                        <Clock size={10} /> Ongoing
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => toast.success('Viewing customer details')} className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white"><Eye size={16} /></button>
                      <button 
                        onClick={() => setEditingCustomer(customer)}
                        className="p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white"
                      >
                        <Edit2 size={16} />
                      </button>
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
                    <option>Ongoing</option>
                    <option>Completed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">KOT / Ticket No.</label>
                  <input type="text" className="input-field bg-white/5 text-white/60 cursor-not-allowed" value={generatedKot} readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Payment Method</label>
                  <select className="input-field bg-dryft-dark">
                    <option>Cash</option>
                    <option>Card / POS</option>
                    <option>UPI / Online</option>
                    <option>Pending Payment</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2 border-t border-white/10 pt-4 mt-2">
                  <h3 className="font-bold text-white mb-2">Service & Billing</h3>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-white/60">Primary Service</label>
                  <select className="input-field bg-dryft-dark" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                    <option value="exterior">Exterior Wash (₹250)</option>
                    <option value="interior_exterior">Interior + Exterior Wash (₹500)</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-white/60">Vehicle Size Add-on</label>
                  <select className="input-field bg-dryft-dark" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                    <option value="standard">Standard Car (No extra charge)</option>
                    <option value="suv">SUV (+₹50)</option>
                    <option value="mpv">MPV / 7-Seater (+₹{selectedService === 'exterior' ? '100' : '150'})</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Custom Add-on Service</label>
                  <input type="text" className="input-field" placeholder="e.g. Engine Detailing" value={customServiceName} onChange={(e) => setCustomServiceName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Custom Amount (₹)</label>
                  <input type="number" className="input-field" placeholder="0" value={customServiceAmount} onChange={(e) => setCustomServiceAmount(e.target.value === '' ? '' : Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Discount Applied (%)</label>
                  <div className="relative">
                    <input type="number" className="input-field" placeholder="0" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value === '' ? '' : Number(e.target.value))} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Final Amount (₹)</label>
                  <input type="text" className="input-field bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold" value={`₹${finalTotal.toFixed(2)}`} readOnly />
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

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Edit Customer Record</h2>
              <button onClick={() => setEditingCustomer(null)} className="text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              toast.success('Customer record updated!');
              setEditingCustomer(null);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Customer Name</label>
                  <input type="text" className="input-field" defaultValue={editingCustomer.name} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Phone Number</label>
                  <input type="text" className="input-field" defaultValue={editingCustomer.phone} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Car Model</label>
                  <input type="text" className="input-field" defaultValue={editingCustomer.car} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Registration Number</label>
                  <input type="text" className="input-field" defaultValue={editingCustomer.plate} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Franchise Branch</label>
                  <select className="input-field bg-dryft-dark" defaultValue={editingCustomer.branch}>
                    <option>Downtown</option>
                    <option>Uptown</option>
                    <option>Westside</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Car Status</label>
                  <select className="input-field bg-dryft-dark" defaultValue={editingCustomer.status === 'pending' ? 'ongoing' : editingCustomer.status}>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">KOT / Ticket No.</label>
                  <input type="text" className="input-field bg-white/5 text-white/60 cursor-not-allowed" defaultValue={editingCustomer.kot || generatedKot} readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Payment Method</label>
                  <select className="input-field bg-dryft-dark" defaultValue={editingCustomer.paymentMethod || 'Cash'}>
                    <option value="Cash">Cash</option>
                    <option value="Card / POS">Card / POS</option>
                    <option value="UPI / Online">UPI / Online</option>
                    <option value="Pending Payment">Pending Payment</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2 border-t border-white/10 pt-4 mt-2">
                  <h3 className="font-bold text-white mb-2">Service & Billing</h3>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-white/60">Primary Service</label>
                  <select className="input-field bg-dryft-dark" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                    <option value="exterior">Exterior Wash (₹250)</option>
                    <option value="interior_exterior">Interior + Exterior Wash (₹500)</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-white/60">Vehicle Size Add-on</label>
                  <select className="input-field bg-dryft-dark" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                    <option value="standard">Standard Car (No extra charge)</option>
                    <option value="suv">SUV (+₹50)</option>
                    <option value="mpv">MPV / 7-Seater (+₹{selectedService === 'exterior' ? '100' : '150'})</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Select Add-on Service</label>
                  <select className="input-field bg-dryft-dark" value={selectedAddon} onChange={(e) => setSelectedAddon(e.target.value)}>
                    <option value="">None</option>
                    <option value="plastic_restoration">Plastic Restoration (₹300 - ₹500)</option>
                    <option value="ceramic_coating">Hybrid Ceramic Coating w/ Warranty (₹2000)</option>
                    <option value="glass_coating">Glass Coating (₹300 - ₹1000 based on size)</option>
                    <option value="scratch_removal">Minor Scratch Removal (₹50 - ₹100 / scratch)</option>
                    <option value="engine_bay">Engine Bay Cleaning + Polish (₹300 - ₹1000)</option>
                    <option value="headlight_restoration">Headlight Restoration (₹799 - ₹2000)</option>
                    <option value="tyre_polish">Permanent Tyre Polish (₹100)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Add-on Amount (₹)</label>
                  <input type="number" className="input-field" placeholder="Enter finalized amount..." value={addonAmount} onChange={(e) => setAddonAmount(e.target.value === '' ? '' : Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Discount Applied (%)</label>
                  <div className="relative">
                    <input type="number" className="input-field" placeholder="0" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value === '' ? '' : Number(e.target.value))} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Final Amount (₹)</label>
                  <input type="text" className="input-field bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold" value={`₹${finalTotal.toFixed(2)}`} readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Notes</label>
                <textarea className="input-field min-h-[100px]" placeholder="Add any specific car wash notes here..."></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setEditingCustomer(null)} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">
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
