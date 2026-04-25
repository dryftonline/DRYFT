'use client';

import { useState } from 'react';
import { Box, Search, AlertTriangle, ArrowUpRight, History } from 'lucide-react';

export default function StockUpdates() {
  const [stock] = useState([
    { id: 1, item: 'Wash Shampoo (5L)', branch: 'Downtown', qty: 45, threshold: 10, lastUpdate: '2h ago', status: 'ok' },
    { id: 2, item: 'Microfiber Towels', branch: 'Uptown', qty: 8, threshold: 15, lastUpdate: '5h ago', status: 'low' },
    { id: 3, item: 'Tire Shine Spray', branch: 'Westside', qty: 3, threshold: 10, lastUpdate: '1d ago', status: 'low' },
    { id: 4, item: 'Vacuum Filters', branch: 'Downtown', qty: 22, threshold: 5, lastUpdate: '3h ago', status: 'ok' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Stock Monitoring</h1>
          <p className="text-white/40 text-sm">Real-time inventory levels across all DRYFT franchises.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white flex items-center gap-2">
            <History size={18} />
            <span>History</span>
          </button>
          <button className="btn-primary">Update Stock</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6">
          <p className="text-white/40 text-xs font-bold uppercase mb-1">Total SKU's</p>
          <p className="text-2xl font-bold text-white">24</p>
        </div>
        <div className="glass-panel p-6 border-amber-500/20">
          <p className="text-amber-500 text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
            <AlertTriangle size={12} /> Low Stock Items
          </p>
          <p className="text-2xl font-bold text-white">2</p>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input type="text" placeholder="Filter by item or branch..." className="input-field pl-10" />
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
                <th className="px-6 py-4">Franchise</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stock.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-white">{item.item}</td>
                  <td className="px-6 py-4 text-white/60">{item.branch}</td>
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
                    <button className="text-dryft-beige hover:text-white p-2 transition-colors">
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
