import { useState } from 'react';
import { Send, Bell, Filter, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Notifications() {
  const [showCompose, setShowCompose] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'Easter Promotion Guidelines', body: 'Please follow the new cleaning protocols for the Easter special event.', priority: 'Important', target: 'All Franchises', date: '2024-04-20', sender: 'SuperAdmin' },
    { id: 2, title: 'System Maintenance', body: 'The dashboard will be offline for 2 hours tonight for scheduled maintenance.', priority: 'Normal', target: 'All Franchises', date: '2024-04-18', sender: 'IT Team' },
    { id: 3, title: 'Urgent: Stock Replenishment', body: 'New chemical shipment has been delayed. Conserve current stock.', priority: 'Urgent', target: 'Downtown, Uptown', date: '2024-04-15', sender: 'SuperAdmin' },
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Notification Center</h1>
          <p className="text-white/40 text-sm">Broadcast messages and internal alerts to your franchises.</p>
        </div>
        <button 
          onClick={() => setShowCompose(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Send size={18} />
          <span>New Broadcast</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-3 bg-dryft-beige text-dryft-dark rounded-xl font-semibold flex items-center justify-between">
            Sent Messages <span className="text-xs bg-black/10 px-2 py-0.5 rounded-full">12</span>
          </button>
          <button className="w-full text-left px-4 py-3 text-white/60 hover:bg-white/5 rounded-xl transition-colors">
            Drafts
          </button>
          <button className="w-full text-left px-4 py-3 text-white/60 hover:bg-white/5 rounded-xl transition-colors">
            Templates
          </button>
        </div>

        {/* Message List */}
        <div className="lg:col-span-3 space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className="glass-panel p-6 hover:border-white/20 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-white text-lg">{n.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    n.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-500' : 
                    n.priority === 'Important' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {n.priority}
                  </span>
                </div>
                <p className="text-xs text-white/30">{n.date}</p>
              </div>
              <p className="text-sm text-white/60 mb-4 line-clamp-2">{n.body}</p>
              <div className="flex items-center justify-between text-xs text-white/40 border-t border-white/5 pt-4">
                <div className="flex gap-4">
                  <span>To: <span className="text-white/60">{n.target}</span></span>
                  <span>From: <span className="text-white/60">{n.sender}</span></span>
                </div>
                <div className="flex items-center gap-1 text-emerald-500">
                  <CheckCircle size={12} /> Delivered
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Compose Broadcast</h2>
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              toast.success('Broadcast sent successfully!');
              setShowCompose(false);
            }}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Message Title</label>
                <input type="text" className="input-field" placeholder="Brief subject line" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Priority</label>
                  <select className="input-field bg-dryft-dark">
                    <option>Normal</option>
                    <option>Important</option>
                    <option>Urgent</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Target Recipients</label>
                  <select className="input-field bg-dryft-dark">
                    <option>All Franchises</option>
                    <option>Selected Franchises</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Message Body</label>
                <textarea className="input-field min-h-[150px]" placeholder="Type your message here..." required></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowCompose(false)} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl">
                  Discard
                </button>
                <button type="submit" className="flex-1 btn-primary py-3">
                  Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
