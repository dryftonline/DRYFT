'use client';

import { useEffect, useState, useRef } from 'react';
import { Camera, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function StaffPortal() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Select Name, 2: Camera/Location, 3: Success

  const videoRef = useRef<HTMLVideoElement>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/staff');
      const data = await res.json();
      if (res.ok) setStaffList(data);
    } catch (e) {
      toast.error('Failed to load staff list');
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
          staffId: selectedStaffId,
          photoData,
          latitude: location.lat,
          longitude: location.lng
        })
      });

      if (res.ok) {
        setStep(3);
      } else {
        toast.error('Failed to mark attendance');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-dryft-darker flex items-center justify-center text-white"><Loader2 className="animate-spin" size={32} /></div>;
  }

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
          <p className="text-white/40 text-sm">Self-service portal for daily check-in.</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60">Select Your Name</label>
              <select 
                className="input-field bg-dryft-dark text-lg py-4"
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
              >
                <option value="">-- Choose your profile --</option>
                {staffList.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={() => {
                if (!selectedStaffId) {
                  toast.error('Please select your name first');
                  return;
                }
                setStep(2);
                startCamera();
                getLocation();
              }}
              className="w-full btn-primary py-4 text-lg"
              disabled={!selectedStaffId}
            >
              Continue to Check-In
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
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

            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setPhotoData(null);
                  setStep(1);
                }} 
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors"
              >
                Back
              </button>
              <button 
                onClick={submitAttendance}
                disabled={isSubmitting || !photoData || !location}
                className="flex-1 btn-primary py-3 disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Mark Attendance'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white">Attendance Logged!</h2>
            <p className="text-white/60 mb-8">Your attendance has been successfully recorded for today.</p>
            
            <button 
              onClick={() => {
                setSelectedStaffId('');
                setPhotoData(null);
                setLocation(null);
                setStep(1);
              }}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors"
            >
              Back to Start
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
