'use client';

import { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');
    
    setIsStandalone(isStandaloneMode);

    if (isStandaloneMode) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for Android install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the custom prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If iOS and not installed, show prompt after a short delay
    if (isIosDevice && !isStandaloneMode) {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const closePrompt = () => {
    setShowPrompt(false);
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-dryft-darker border border-white/10 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 backdrop-blur-xl">
        <button 
          onClick={closePrompt}
          className="absolute top-2 right-2 text-white/40 hover:text-white"
        >
          <X size={18} />
        </button>
        
        <div className="flex items-center gap-4 pr-6">
          <div className="w-16 h-16 flex-shrink-0">
            <img src="/logo.png" alt="DRYFT Logo" className="w-full h-full object-contain rounded-xl drop-shadow-md" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Install DRYFT Admin</h3>
            <p className="text-white/60 text-xs">Access the dashboard anytime from your home screen.</p>
          </div>
        </div>

        {isIOS ? (
          <div className="bg-white/5 rounded-xl p-3 text-xs text-white/80 border border-white/5">
            To install, tap <Share size={14} className="inline mx-1" /> and then <strong>Add to Home Screen</strong>
          </div>
        ) : (
          <button 
            onClick={handleInstallClick}
            className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 text-sm mt-1"
          >
            <Download size={16} />
            <span>Install App</span>
          </button>
        )}
      </div>
    </div>
  );
}
