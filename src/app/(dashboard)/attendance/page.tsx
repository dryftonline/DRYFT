'use client';

import { useEffect, useState, useRef } from 'react';
import { Camera, MapPin, CheckCircle2, Loader2, Play } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export default function MarkAttendance() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Camera/Location Capture, 2: Success

  const videoRef = useRef<HTMLVideoElement>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    if (user?.staffId) {
      startCamera();
      getLocation();
    } else {
      toast.error('This account is not linked to a staff record. Attendance cannot be logged.');
    }

    return () => {
      // Stop camera stream when leaving
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      }
    };
  }, [user]);

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
        toast.success('Attendance registered successfully!');
        setStep(2);
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

  if (!user?.staffId) {
    return (
      <div className="glass-panel p-8 text-center max-w-md mx-auto mt-12">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin size={32} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-white/40 text-sm">
          This login account is not linked to a staff member record. Only active staff members can register attendance here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Mark Attendance</h1>
        <p className="text-white/40 text-sm">Register your work check-in with photo and GPS location details.</p>
      </div>

      <div className="glass-panel p-6 space-y-6">
        {step === 1 && (
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
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <MapPin className={location ? "text-emerald-500" : "text-amber-500"} size={24} />
                  <div>
                    <p className="text-sm font-medium text-white">Location Status</p>
                    <p className="text-xs text-white/40">
                      {location ? `GPS coordinates captured` : "Waiting for location..."}
                    </p>
                  </div>
                </div>
                {!location && (
                  <button 
                    onClick={getLocation}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Retry GPS
                  </button>
                )}
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

        {step === 2 && (
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white">Attendance Logged!</h2>
            <p className="text-white/60 mb-8">Hello {user?.username}, your check-in has been successfully registered for today.</p>
            
            <button 
              onClick={() => {
                setPhotoData(null);
                setStep(1);
                startCamera();
              }}
              className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
            >
              Mark Attendance Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
