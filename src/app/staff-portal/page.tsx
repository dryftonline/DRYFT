import { useEffect, useState, useRef } from 'react';
import { Camera, MapPin, CheckCircle2, Loader2, LogIn, User, Lock, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export default function StaffPortal() {
  const { user, login, logout, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Login, 2: Camera/Location, 3: Success

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.staffId) {
        setStep(2);
        startCamera();
        getLocation();
      } else {
        toast.error('This account is not linked to a staff record.');
        logout();
      }
    } else {
      setStep(1);
    }
  }, [isAuthenticated, user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        if (!data.user.staffId) {
          toast.error('Account found, but it is not a staff member account.');
          return;
        }
        login(data.user, data.token);
        toast.success('Login successful!');
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    } catch (e) {
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error('Camera access denied or unavailable.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 400; // compress image
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setPhotoData(dataUrl);
        
        // Stop camera stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      }
    }
  };

  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          toast.error('Location access denied or unavailable.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const submitAttendance = async () => {
    if (!photoData || !location) {
      toast.error('Photo and location are required!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/staff/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: user?.staffId,
          photoData,
          latitude: location.lat,
          longitude: location.lng
        })
      });

      if (res.ok) {
        setStep(3);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to mark attendance');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dryft-darker flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 glass-panel p-8">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="DRYFT Logo" className="h-16 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-white mb-2">Staff Attendance</h1>
          <p className="text-white/40 text-sm">Secure self-service check-in portal.</p>
        </div>

        {step === 1 && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input 
                    type="text" 
                    className="input-field pl-10" 
                    placeholder="Enter username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input 
                    type="password" 
                    className="input-field pl-10" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
              Login to Check-In
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-dryft-beige text-dryft-dark flex items-center justify-center font-bold">
                  {user?.username[0].toUpperCase()}
                </div>
                <p className="text-sm font-medium text-white">{user?.username}</p>
              </div>
              <button onClick={logout} className="text-white/40 hover:text-rose-500 transition-colors">
                <LogOut size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-black/50 rounded-xl overflow-hidden border border-white/10 aspect-video relative flex items-center justify-center">
                {photoData ? (
                  <img src={photoData} alt="Selfie" className="w-full h-full object-cover" />
                ) : (
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                )}
                
                {!photoData && (
                  <button 
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
                  >
                    <Camera size={18} /> Take Selfie
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <MapPin className={location ? "text-emerald-500" : "text-amber-500"} size={24} />
                <div>
                  <p className="text-sm font-medium text-white">Location Status</p>
                  <p className="text-xs text-white/40">
                    {location ? "GPS coordinates captured" : "Waiting for location..."}
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={submitAttendance}
              disabled={isSubmitting || !photoData || !location}
              className="w-full btn-primary py-4 text-lg disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Confirm Check-In'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white">Attendance Logged!</h2>
            <p className="text-white/60 mb-8">Hello {user?.username}, your attendance has been recorded.</p>
            
            <button 
              onClick={() => {
                setPhotoData(null);
                setStep(2);
                startCamera();
              }}
              className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors"
            >
              Check-In Again
            </button>
            <button 
              onClick={logout}
              className="w-full py-2 text-white/40 hover:text-white transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
