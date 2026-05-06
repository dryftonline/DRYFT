'use client';

import { useState } from 'react';
import { Box, Search, AlertTriangle, ArrowUpRight, History, X, Package, Plus, Minus, Trash2, Store, ChevronLeft, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function StockUpdates() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState<string | null>(null);
  
  const [franchises] = useState([
    { id: 1, name: 'Downtown', location: 'City Center', lowStock: 1 },
    { id: 2, name: 'Uptown', location: 'North Side', lowStock: 1 },
    { id: 3, name: 'Westside', location: 'West Square', lowStock: 1 },
  ]);

  const [stock, setStock] = useState([
    { id: 1, item: 'Wash Shampoo (5L)', branch: 'Downtown', qty: 45, threshold: 10, lastUpdate: '2h ago', status: 'ok' },
    { id: 2, item: 'Microfiber Towels', branch: 'Uptown', qty: 8, threshold: 15, lastUpdate: '5h ago', status: 'low' },
    { id: 3, item: 'Tire Shine Spray', branch: 'Westside', qty: 3, threshold: 10, lastUpdate: '1d ago', status: 'low' },
    { id: 4, item: 'Vacuum Filters', branch: 'Downtown', qty: 22, threshold: 5, lastUpdate: '3h ago', status: 'ok' },
    { id: 5, item: 'Interior Cleaner', branch: 'Downtown', qty: 12, threshold: 5, lastUpdate: '1h ago', status: 'ok' },
  ]);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to remove this item from stock monitoring?')) {
      setStock(stock.filter(s => s.id !== id));
      toast.success('Item removed from monitoring');
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
                  {filteredStock.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4 font-medium text-white">{item.item}</td>
                      <td className="px-6 py-4 text-white">
                        <span className={item.status === 'low' ? 'text-amber-500 font-bold' : ''}>
                          {item.qty}
                        </span>
                        <span className="text-white/20 text-xs ml-2">/ thr: {item.threshold}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-white/30">{item.lastUpdate}</td>
                      <td className="px-6 py-4">
                        {item.status === 'low' ? (
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

            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              toast.success('Stock levels updated successfully!');
              setShowUpdateModal(false);
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
                    <select className="input-field pl-10 bg-dryft-dark">
                      <option>Wash Shampoo (5L)</option>
                      <option>Microfiber Towels</option>
                      <option>Tire Shine Spray</option>
                      <option>Vacuum Filters</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Action</label>
                    <div className="flex gap-2">
                      <button type="button" className="flex-1 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg flex items-center justify-center gap-2">
                        <Plus size={16} /> Add
                      </button>
                      <button type="button" className="flex-1 py-2 bg-white/5 text-white/40 border border-white/10 rounded-lg flex items-center justify-center gap-2">
                        <Minus size={16} /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Quantity</label>
                    <input type="number" className="input-field" placeholder="0" required />
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
    </div>
  );
}
