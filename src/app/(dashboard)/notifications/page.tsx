'use client';

import { useState } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Clock,
  MoreVertical,
  Trash2,
  CheckCheck,
  User,
  Store,
  Package,
  Send,
  X,
  AlertTriangle,
  Megaphone
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  
  // Mock Notifications
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: 'Low Stock Alert', 
      message: 'Chemical A is below threshold at Downtown Branch. Current quantity: 8 units.', 
      type: 'urgent', 
      category: 'stock',
      time: '10 minutes ago',
      read: false
    },
    { 
      id: 2, 
      title: 'New User Registered', 
      message: 'A new manager "johnd_manager" has been assigned to Downtown Branch.', 
      type: 'info', 
      category: 'user',
      time: '1 hour ago',
      read: true
    },
    { 
      id: 3, 
      title: 'Monthly Report Ready', 
      message: 'The performance report for April 2024 is now available for download.', 
      type: 'success', 
      category: 'system',
      time: '3 hours ago',
      read: false
    },
    { 
      id: 4, 
      title: 'Franchise Update', 
      message: 'Uptown Premium franchise has updated their service pricing.', 
      type: 'info', 
      category: 'franchise',
      time: '5 hours ago',
      read: true
    },
    { 
      id: 5, 
      title: 'Critical Failure', 
      message: 'Backup synchronization failed for Westside Auto. Retrying in 5 minutes.', 
      type: 'urgent', 
      category: 'system',
      time: 'Yesterday at 11:45 PM',
      read: false
    },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification removed');
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'stock': return Package;
      case 'user': return User;
      case 'franchise': return Store;
      default: return Bell;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-rose-500/10 text-rose-500';
      case 'success': return 'bg-emerald-500/10 text-emerald-500';
      case 'info': return 'bg-blue-500/10 text-blue-500';
      default: return 'bg-white/5 text-white/40';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-white/40 text-sm">Stay updated with system activities and alerts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowBroadcastModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Send size={18} />
            <span>Send Notification</span>
          </button>
          <button 
            onClick={markAllRead}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white flex items-center gap-2 transition-all text-sm font-medium"
          >
            <CheckCheck size={18} />
            <span>Mark all as read</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text" 
            placeholder="Search notifications..." 
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white flex items-center gap-2">
            <Filter size={18} />
            <span>All Categories</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.filter(n => 
          n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          n.message.toLowerCase().includes(searchTerm.toLowerCase())
        ).map((notification) => {
          const Icon = getIcon(notification.category);
          return (
            <div 
              key={notification.id} 
              className={cn(
                "glass-panel p-5 transition-all group relative overflow-hidden",
                !notification.read && "border-l-4 border-l-dryft-beige bg-white/[0.07]"
              )}
            >
              <div className="flex gap-4">
                <div className={cn("p-3 rounded-xl h-fit", getTypeStyles(notification.type))}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={cn("font-bold", notification.read ? "text-white/80" : "text-white")}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/20 font-medium flex items-center gap-1">
                        <Clock size={10} /> {notification.time}
                      </span>
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/5 rounded transition-all text-white/20 hover:text-rose-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-white/30 border border-white/5">
                      {notification.category}
                    </span>
                    {!notification.read && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-dryft-beige/10 text-dryft-beige border border-dryft-beige/10">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      </div>

      {/* Broadcast Notification Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-dryft-beige/10 text-dryft-beige rounded-lg">
                  <Megaphone size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Broadcast Notification</h2>
              </div>
              <button onClick={() => setShowBroadcastModal(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              toast.success('Broadcast notification sent successfully!');
              setShowBroadcastModal(false);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Target Recipient</label>
                  <select className="input-field bg-dryft-dark">
                    <option>All Franchises</option>
                    <option>Downtown Branch</option>
                    <option>Uptown Premium</option>
                    <option>Westside Auto</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Notification Type</label>
                  <select className="input-field bg-dryft-dark">
                    <option>Information</option>
                    <option>Warning</option>
                    <option>Urgent Alert</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Message Title</label>
                <input type="text" className="input-field" placeholder="e.g. System Maintenance Tomorrow" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Message Content</label>
                <textarea className="input-field min-h-[120px]" placeholder="Type your message to the franchises here..." required></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowBroadcastModal(false)} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary py-3 flex items-center justify-center gap-2">
                  <Send size={18} />
                  <span>Send Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
