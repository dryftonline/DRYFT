'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Box, 
  Bell, 
  UserCog, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SidebarLink = ({ href, icon: Icon, children, active, onClick }: any) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-dryft-beige text-dryft-dark font-semibold shadow-lg shadow-dryft-beige/10" 
        : "text-white/60 hover:text-white hover:bg-white/5"
    )}
  >
    <Icon size={20} className={cn("transition-colors", active ? "text-dryft-dark" : "group-hover:text-white")} />
    <span>{children}</span>
  </Link>
);

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Customers', icon: Users, path: '/customers' },
    { label: 'Franchises', icon: Store, path: '/franchises' },
    { label: 'Stock Updates', icon: Box, path: '/stock' },
    { label: 'Staff Management', icon: Users, path: '/staff' },
    { label: 'Notifications', icon: Bell, path: '/notifications' },
    { label: 'System Users', icon: UserCog, path: '/users' },
    { label: 'Reports', icon: BarChart3, path: '/reports' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  if (!mounted) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-dryft-dark flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-white/5 p-6 space-y-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-4">
          <img src="/logo.png" alt="DRYFT Logo" className="h-14 w-auto object-contain rounded-lg" />
          <h1 className="text-2xl font-bold tracking-tight">DRYFT</h1>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => (
            <SidebarLink 
              key={item.path} 
              href={item.path} 
              icon={item.icon} 
              active={pathname === item.path}
            >
              {item.label}
            </SidebarLink>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-white/60 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all duration-200"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden">
          <aside className="w-72 h-full bg-dryft-dark p-6 flex flex-col border-r border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="DRYFT Logo" className="h-14 w-auto object-contain rounded-lg" />
                <h1 className="text-2xl font-bold">DRYFT</h1>
              </div>
              <button onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
            </div>
            <nav className="flex-1 flex flex-col gap-1">
              {navItems.map((item) => (
                <SidebarLink 
                  key={item.path} 
                  href={item.path} 
                  icon={item.icon} 
                  active={pathname === item.path}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.label}
                </SidebarLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-20 border-b border-white/5 px-4 lg:px-8 flex items-center justify-between bg-dryft-dark/50 backdrop-blur-xl sticky top-0 z-40">
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
          
          <div className="flex-1 lg:flex-none">
            <h2 className="text-lg font-semibold lg:hidden">DRYFT</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.username || 'Admin'}</p>
              <p className="text-xs text-white/40">{user?.role || 'Super Admin'}</p>
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-full border border-white/10 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-dryft-beige/20 to-dryft-beige/5 flex items-center justify-center">
                <span className="text-sm font-bold text-dryft-beige">
                  {user?.username?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
