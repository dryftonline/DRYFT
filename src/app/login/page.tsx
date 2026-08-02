'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';
import { LogIn, Lock, User as UserIcon, Loader2, Eye, EyeOff, UserPlus, Building, Shield } from 'lucide-react';
import axios from 'axios';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedFranchiseId, setSelectedFranchiseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Signup State
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupFullName, setSignupFullName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupRole, setSignupRole] = useState('Operator');
  const [signupFranchiseId, setSignupFranchiseId] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  
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

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupUsername || !signupPassword) return toast.error('Username and password are required');
    if (signupPassword !== signupConfirmPassword) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      const res = await axios.post('/api/auth/signup', {
        username: signupUsername,
        password: signupPassword,
        fullName: signupFullName,
        phone: signupPhone,
        roleName: signupRole,
        franchiseId: signupFranchiseId || null
      });

      toast.success(res.data.message || 'Registration request submitted! Awaiting Super Admin approval.');
      setMode('login');
      setUsername(signupUsername);
      setPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Signup request failed');
    } finally {
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
          <p className="text-white/40 text-sm">Secure Portal & Employee Access</p>
        </div>

        <div className="glass-panel p-8">
          {/* Mode Switcher Tabs */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                mode === 'login' ? 'bg-dryft-beige text-dryft-dark shadow-lg' : 'text-white/40 hover:text-white'
              }`}
            >
              <LogIn size={16} />
              <span>Login</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                mode === 'signup' ? 'bg-dryft-beige text-dryft-dark shadow-lg' : 'text-white/40 hover:text-white'
              }`}
            >
              <UserPlus size={16} />
              <span>Employee Sign Up</span>
            </button>
          </div>

          {mode === 'login' ? (
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

              {/* Working Branch Selector for Shift */}
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
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60 ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    type="text"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    className="input-field pl-10"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 ml-1">Desired Username</label>
                  <input
                    type="text"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    className="input-field"
                    placeholder="johndoe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 ml-1">Phone Number</label>
                  <input
                    type="text"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="input-field"
                    placeholder="+91..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 ml-1">Role / Job Title</label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value)}
                    className="input-field bg-dryft-dark text-white border-white/10"
                  >
                    <option value="Operator">Operator</option>
                    <option value="Manager">Manager</option>
                    <option value="Washer">Washer</option>
                    <option value="Detailer">Detailer</option>
                    <option value="Cleaner">Cleaner</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 ml-1">Preferred Branch (Optional)</label>
                  <select
                    value={signupFranchiseId}
                    onChange={(e) => setSignupFranchiseId(e.target.value)}
                    className="input-field bg-dryft-dark text-white border-white/10"
                  >
                    <option value="">Set by Super Admin</option>
                    {franchises.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60 ml-1">Choose Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white p-1 rounded-md hover:bg-black/80 transition-colors"
                  >
                    {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    type={showSignupConfirmPassword ? "text" : "password"}
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white p-1 rounded-md hover:bg-black/80 transition-colors"
                  >
                    {showSignupConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
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
                    <UserPlus size={20} />
                    <span>Submit Registration Request</span>
                  </>
                )}
              </button>
            </form>
          )}

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
