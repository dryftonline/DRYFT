'use client';

import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Database,
  Save,
  Moon,
  Sun,
  Monitor,
  Lock,
  Mail,
  Smartphone
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Database },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Application Settings</h1>
        <p className="text-white/40 text-sm">Configure your personal preferences and system-wide settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tabs Sidebar */}
        <aside className="lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-dryft-beige text-dryft-dark shadow-lg shadow-dryft-beige/10" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          <div className="glass-panel p-8">
            <form onSubmit={handleSave} className="space-y-8">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white mb-4">General Preferences</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/60">System Language</label>
                      <select className="input-field bg-dryft-dark">
                        <option>English (US)</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>Arabic</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/60">Timezone</label>
                      <select className="input-field bg-dryft-dark">
                        <option>(GMT+05:30) India Standard Time</option>
                        <option>(GMT-05:00) Eastern Time</option>
                        <option>(GMT+00:00) UTC</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <label className="text-sm font-medium text-white/60">Interface Theme</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'dark', label: 'Dark', icon: Moon },
                        { id: 'light', label: 'Light', icon: Sun },
                        { id: 'system', label: 'System', icon: Monitor },
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          type="button"
                          className={cn(
                            "flex flex-col items-center gap-3 p-4 rounded-xl border transition-all",
                            theme.id === 'dark' 
                              ? "bg-white/10 border-dryft-beige/50 text-white" 
                              : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
                          )}
                        >
                          <theme.icon size={20} />
                          <span className="text-xs">{theme.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white mb-4">Profile Information</h3>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-dryft-beige/20 to-dryft-beige/5 flex items-center justify-center text-dryft-beige text-2xl font-bold border border-white/10 relative group cursor-pointer">
                      S
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <User size={20} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-bold">superadmin</h4>
                      <p className="text-sm text-white/40">Super Administrator</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/60">Display Name</label>
                      <input type="text" className="input-field" defaultValue="DRYFT Admin" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/60">Email Address</label>
                      <input type="email" className="input-field" defaultValue="admin@dryft.com" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white mb-4">Security Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                          <Shield size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                          <p className="text-xs text-white/40">Add an extra layer of security to your account.</p>
                        </div>
                      </div>
                      <button type="button" className="text-dryft-beige text-xs font-bold hover:underline">Enable</button>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                          <Lock size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Password Change</p>
                          <p className="text-xs text-white/40">Last changed 3 months ago.</p>
                        </div>
                      </div>
                      <button type="button" className="text-dryft-beige text-xs font-bold hover:underline">Update</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white mb-4">Notification Preferences</h3>
                  
                  <div className="space-y-6">
                    {[
                      { id: 'email', label: 'Email Notifications', icon: Mail, desc: 'Receive daily reports and urgent alerts via email.' },
                      { id: 'push', label: 'Push Notifications', icon: Bell, desc: 'Real-time alerts on your browser and mobile device.' },
                      { id: 'sms', label: 'SMS Alerts', icon: Smartphone, desc: 'Critical stock and system failures via text message.' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white/5 text-white/40 rounded-lg">
                            <item.icon size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{item.label}</p>
                            <p className="text-xs text-white/40">{item.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={item.id !== 'sms'} />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dryft-beige"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-white/5">
                <button type="submit" className="btn-primary flex items-center gap-2 px-8">
                  <Save size={18} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
