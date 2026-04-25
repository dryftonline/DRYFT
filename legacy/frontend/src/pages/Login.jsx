import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { toast } from 'react-hot-toast';
import { LogIn, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.error('Please fill all fields');

    setLoading(true);
    try {
      // In a real app, this would be: 
      // const res = await axios.post('/api/auth/login', { username, password });
      // const { user, token } = res.data;
      
      // FOR TEST PHASE MOCKUP:
      if (username === 'superadmin' && password === 'admin123') {
        const mockUser = { username: 'superadmin', role: 'Super Admin', id: 1 };
        const mockToken = 'mock-jwt-token';
        
        setTimeout(() => {
          login(mockUser, mockToken);
          toast.success('Welcome back, DRYFT Admin!');
          navigate('/');
        }, 800);
      } else {
        toast.error('Invalid credentials');
        setLoading(false);
      }
    } catch (error) {
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
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-dryft-beige rounded-2xl mx-auto flex items-center justify-center font-bold text-dryft-dark text-3xl shadow-xl shadow-dryft-beige/10 mb-6">
            D
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome to DRYFT</h1>
          <p className="text-white/40">Secure Admin Access Control</p>
        </div>

        <div className="glass-panel p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
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
                  <LogIn size={20} />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-white/30 italic">
              "DRYFT - Premium Car Care Management System"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
