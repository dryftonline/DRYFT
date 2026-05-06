'use client';

import { useEffect, useState } from 'react';
import { Box, Search, AlertTriangle, ArrowUpRight, History, X, Package, Plus, Minus, Trash2, Store, ChevronLeft, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function StockUpdates() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState<string | null>(null);
  const [stock, setStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [franchises, setFranchises] = useState<any[]>([]);

  useEffect(() => {
    fetchFranchises();
  }, []);

  useEffect(() => {
    if (selectedFranchise) {
      fetchStock(selectedFranchise);
    }
  }, [selectedFranchise]);

  const fetchFranchises = async () => {
    try {
      const res = await fetch('/api/franchises');
      const data = await res.json();
      if (res.ok) setFranchises(data);
    } catch (error) {}
  };

  const fetchStock = async (branchName: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stock?franchise=${encodeURIComponent(branchName)}`);
      const data = await res.json();
      if (res.ok) setStock(data);
    } catch (error) {
      toast.error('Failed to load stock');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to remove this item from stock monitoring?')) {
      try {
        const res = await fetch(`/api/stock/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setStock(stock.filter(s => s.id !== id));
          toast.success('Item removed from monitoring');
        } else {
          toast.error('Failed to remove item');
        }
      } catch (error) {
        toast.error('An error occurred');
      }
    }
  };

  const filteredStock = selectedFranchise 
    ? stock.filter(s => s.branch === selectedFranchise)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {selectedFranchise && (
            <button 
              onClick={() => setSelectedFranchise(null)}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">
              {selectedFranchise ? `${selectedFranchise} Stock` : 'Stock Monitoring'}
            </h1>
            <p className="text-white/40 text-sm">
              {selectedFranchise 
                ? `Inventory levels for ${selectedFranchise} franchise.`
                : 'Select a franchise to view and manage its inventory.'
              }
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white flex items-center gap-2">
            <History size={18} />
            <span>History</span>
          </button>
          {selectedFranchise && (
            <button 
              onClick={() => setShowUpdateModal(true)}
              className="btn-primary"
            >
              Update Stock
            </button>
          )}
        </div>
      </div>

      {!selectedFranchise ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {franchises.map((f) => (
            <button 
              key={f.id}
              onClick={() => setSelectedFranchise(f.name)}
              className="glass-panel p-6 text-left hover:border-dryft-beige/50 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-dryft-beige group-hover:bg-dryft-beige group-hover:text-dryft-dark transition-all duration-300">
                  <Store size={24} />
                </div>
                {f.lowStock > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
                    <AlertTriangle size={10} /> {f.lowStock} Low Stock
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{f.name}</h3>
              <p className="text-sm text-white/40 mb-4">{f.location}</p>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-white/60">View Inventory</span>
                <ArrowRight size={16} className="text-dryft-beige group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6">
              <p className="text-white/40 text-xs font-bold uppercase mb-1">Items Monitored</p>
              <p className="text-2xl font-bold text-white">{filteredStock.length}</p>
            </div>
            <div className="glass-panel p-6 border-amber-500/20">
              <p className="text-amber-500 text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
                <AlertTriangle size={12} /> Low Stock Items
              </p>
              <p className="text-2xl font-bold text-white">
                {filteredStock.filter(s => s.status === 'low').length}
              </p>
            </div>
          </div>

          <div className="glass-panel overflow-hidden">
            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input type="text" placeholder="Filter by item..." className="input-field pl-10" />
              </div>
              <select className="input-field w-full md:w-48 bg-dryft-dark">
                <option>All Statuses</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4">Inventory Item</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Last Updated</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stock.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4 font-medium text-white">{item.stockItem?.name}</td>
                      <td className="px-6 py-4 text-white">
                        <span className={item.availableQuantity < item.lowStockThreshold ? 'text-amber-500 font-bold' : ''}>
                          {item.availableQuantity}
                        </span>
                        <span className="text-white/20 text-xs ml-2">/ thr: {item.lowStockThreshold}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-white/30">{item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-6 py-4">
                        {item.availableQuantity < item.lowStockThreshold ? (
                          <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-[10px] font-bold uppercase">Critical</span>
                        ) : (
                          <span className="px-2 py-1 bg-white/5 text-white/40 rounded text-[10px] font-bold uppercase">Healthy</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="text-dryft-beige hover:text-white p-2 transition-colors">
                            <ArrowUpRight size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="text-white/20 hover:text-red-500 p-2 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Update Stock Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Update Stock Levels</h2>
              <button onClick={() => setShowUpdateModal(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const stockId = formData.get('stockId');
              const quantity = formData.get('quantity');
              
              try {
                const res = await fetch(`/api/stock/${stockId}`, {
                  method: 'PATCH',
                  body: JSON.stringify({ 
                    availableQuantity: parseInt(quantity as string),
                  }),
                });
                if (res.ok) {
                  toast.success('Stock levels updated successfully!');
                  setShowUpdateModal(false);
                  if (selectedFranchise) fetchStock(selectedFranchise);
                }
              } catch (error) {
                toast.error('Failed to update stock');
              }
            }}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Franchise Branch</label>
                  <select className="input-field bg-dryft-dark">
                    <option>Downtown</option>
                    <option>Uptown</option>
                    <option>Westside</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Inventory Item</label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <select name="stockId" className="input-field pl-10 bg-dryft-dark" required>
                      {stock.map(item => (
                        <option key={item.id} value={item.id}>{item.stockItem?.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Adjustment Type</label>
                    <select name="type" className="input-field bg-dryft-dark">
                      <option value="set">Set Absolute (=)</option>
                      <option value="add">Add Stock (+)</option>
                      <option value="remove">Remove Stock (-)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Quantity</label>
                    <input type="number" name="quantity" className="input-field" placeholder="0" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Notes / Reason</label>
                  <textarea className="input-field min-h-[80px]" placeholder="e.g. Restock from main warehouse..."></textarea>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowUpdateModal(false)} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary py-3">
                  Submit Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-dryft-beige/10 text-dryft-beige rounded-lg">
                  <Box size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Add New Product SKU</h2>
              </div>
              <button onClick={() => setShowAddProductModal(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              toast.success('New product SKU added to system!');
              setShowAddProductModal(false);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Product Name</label>
                  <input type="text" className="input-field" placeholder="e.g. Premium Wax (2L)" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Category</label>
                  <select className="input-field bg-dryft-dark">
                    <option>Chemicals</option>
                    <option>Tools & Equipment</option>
                    <option>Cleaning Supplies</option>
                    <option>Accessories</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Initial Quantity</label>
                  <input type="number" className="input-field" placeholder="0" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Low Stock Threshold</label>
                  <input type="number" className="input-field" placeholder="10" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Assigned Franchises</label>
                <div className="grid grid-cols-2 gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                  {['Downtown', 'Uptown', 'Westside', 'Eastbay'].map((f) => (
                    <label key={f} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-dryft-beige focus:ring-dryft-beige/20" />
                      <span className="text-sm text-white/60 group-hover:text-white transition-colors">{f}</span>
                    </label>
                  ))}
                </div>
                <p className="text-[10px] text-white/20 mt-1 italic">* Product will be initialized in these branches with the specified quantity.</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddProductModal(false)} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary py-3 flex items-center justify-center gap-2">
                  <Plus size={18} />
                  <span>Register Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
