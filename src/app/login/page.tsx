'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';
import { LogIn, Lock, User as UserIcon, Loader2, Eye, EyeOff, Building } from 'lucide-react';
import axios from 'axios';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedFranchiseId, setSelectedFranchiseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [franchises, setFranchises] = useState<any[]>([]);

  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    fetchFranchises();
  }, []);

  const fetchFranchises = async () => {
    try {
      const res = await axios.get('/api/franchises');
      setFranchises(res.data || []);
    } catch (e) {}
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return toast.error('Please fill all fields');

    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { 
        username, 
        password,
        selectedFranchiseId: selectedFranchiseId || undefined 
      });
      const { user, token } = res.data;
      
      login(user, token);
      toast.success(`Welcome back, ${user.username || 'DRYFT User'}! Active Branch: ${user.franchise || 'Main Branch'}`);
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dryft-darker flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-dryft-beige/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-dryft-beige/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-28 h-28 mx-auto mb-4 flex items-center justify-center">
            <img src="/logo.png" alt="DRYFT Logo" className="w-full h-full object-contain drop-shadow-xl" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Welcome to DRYFT</h1>
          <p className="text-white/40 text-sm">Secure Admin & Portal Access Control</p>
        </div>

        <div className="glass-panel p-8">
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60 ml-1">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your username"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white p-1.5 rounded-md hover:bg-black/80 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Shift Working Branch Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60 ml-1">Shift Working Branch (Optional)</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <select
                  value={selectedFranchiseId}
                  onChange={(e) => setSelectedFranchiseId(e.target.value)}
                  className="input-field pl-10 bg-dryft-dark text-white border-white/10"
                >
                  <option value="">Assigned Default Branch</option>
                  {franchises.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <p className="text-[10px] text-white/40 ml-1">Select if working at a different branch for today's shift.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-12 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-white/30 italic">
              "DRYFT - Premium Car Care Management System"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
