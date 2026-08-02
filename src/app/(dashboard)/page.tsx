'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Store, 
  Car, 
  Box, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Target,
  Trophy,
  Rocket,
  Sparkles,
  CheckCircle2,
  Zap,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Filler, 
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuthStore } from '@/store/authStore';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="glass-panel p-6 hover:border-white/20 transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-xl bg-opacity-10", color)}>
        <Icon size={24} className={cn("text-opacity-90", color.replace('bg-', 'text-'))} />
      </div>
      {trend && (
        <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <p className="text-white/40 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
  </div>
);

export default function Dashboard() {
  const currentUser = useAuthStore((state) => state.user);
  const [stats, setStats] = useState({ customers: 0, franchises: 0, stock: 0 });
  const [myStaffGoal, setMyStaffGoal] = useState<any>(null);

  const loadDashboardData = () => {
    Promise.all([
      fetch('/api/customers').then(res => res.ok ? res.json() : []),
      fetch('/api/franchises').then(res => res.ok ? res.json() : []),
      fetch('/api/stock').then(res => res.ok ? res.json() : []),
      fetch('/api/staff').then(res => res.ok ? res.json() : [])
    ]).then(([cust, fran, st, staffList]) => {
      setStats({
        customers: cust.length || 0,
        franchises: fran.length || 0,
        stock: st.length || 0
      });

      if (staffList && staffList.length > 0) {
        let matched = staffList.find((s: any) => s.id === currentUser?.staffId);
        if (!matched && currentUser?.username) {
          matched = staffList.find((s: any) => s.name.toLowerCase().includes(currentUser.username.toLowerCase()));
        }
        setMyStaffGoal(matched || staffList[0]);
      }
    }).catch(console.error);
  };

  useEffect(() => {
    loadDashboardData();

    // Auto refresh stats and task done bar every 4 seconds
    const interval = setInterval(() => {
      loadDashboardData();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const target = myStaffGoal?.dailyTarget || 10;
  const completed = myStaffGoal?.todayJobsCount || myStaffGoal?.jobsDoneCount || 0;
  const percentage = Math.min(100, Math.round((completed / target) * 100));

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        fill: true,
        label: 'Cars Washed',
        data: [completed, completed + 2, completed + 4, completed + 1, completed + 5, completed + 3, completed],
        borderColor: '#d1c7b7',
        backgroundColor: 'rgba(209, 199, 183, 0.05)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a1a',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: 'rgba(255,255,255,0.3)' } },
      x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.3)' } }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-white/40 text-sm">Welcome back, <span className="text-dryft-beige font-semibold">{currentUser?.username || 'Employee'}</span>! DRYFT administration console.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-white/60">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Shift Branch: {currentUser?.franchise || 'Main Branch'}
        </div>
      </div>

      {/* Daily Goal Work Reminder & Progress Meter Widget */}
      {myStaffGoal && (
        <div className="space-y-4">
          <div className="glass-panel p-6 border-dryft-beige/30 bg-gradient-to-r from-dryft-darker via-white/[0.02] to-dryft-darker relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 z-10 relative">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Target size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Daily Work Target Goal
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70 font-mono">
                      {myStaffGoal.name} ({myStaffGoal.role})
                    </span>
                  </h2>
                  <p className="text-xs text-white/50">
                    Target set by Super Admin: <span className="text-amber-400 font-bold">{target} Cars/Jobs Today</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/10">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Goal Progress</p>
                  <p className="text-lg font-bold text-emerald-400 font-mono">{completed} / {target} Cars</p>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 flex items-center justify-center bg-emerald-500/10 text-emerald-400 font-bold text-xs font-mono">
                  {percentage}%
                </div>
              </div>
            </div>

            {/* Task Done Bar */}
            <div className="space-y-2 z-10 relative">
              <div className="w-full bg-white/10 h-4 rounded-full p-0.5 border border-white/10 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 h-full rounded-full transition-all duration-1000 shadow-lg relative"
                  style={{ width: `${percentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-white/50 pt-1">
                <span>0%</span>
                <span className="text-amber-400 font-bold">50% Halfway Milestone</span>
                <span className="text-emerald-400 font-bold">100% Target Smashed! 🏆</span>
              </div>
            </div>
          </div>

          {/* 50% Motivation Celebration Banner */}
          {percentage >= 50 && percentage < 100 && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 flex items-center justify-between gap-4 animate-fadeIn shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/40 animate-bounce">
                  <Rocket size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                    Halfway Mark Milestone Reached! 🚀✨
                    <span className="text-xs bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full font-mono">{percentage}% Completed</span>
                  </h3>
                  <p className="text-xs text-white/80 mt-0.5">
                    Fantastic effort! You've completed 50%+ of your daily target ({completed} of {target} cars). Keep pushing, you are close to the finish line!
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-amber-300 font-bold text-xs bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30">
                <Zap size={14} />
                <span>Great Momentum!</span>
              </div>
            </div>
          )}

          {/* 100% Goal Accomplished Appreciation Trophy Animation Banner */}
          {percentage >= 100 && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/30 via-emerald-500/15 to-dryft-beige/20 border-2 border-emerald-400/50 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-4 z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center border border-emerald-400/50 shadow-lg animate-spin-slow">
                  <Trophy size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500 text-dryft-dark text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider">
                      100% GOAL ACCOMPLISHED 🏆
                    </span>
                    <Sparkles className="text-amber-300 animate-bounce" size={16} />
                  </div>
                  <h3 className="text-xl font-extrabold text-white mt-1">
                    Outstanding Job! Target Smashed Today! 🎉🌟
                  </h3>
                  <p className="text-xs text-emerald-200/90 mt-1">
                    You have completed 100% of your daily task goal ({completed} cars washed/serviced). Excellent dedication and performance!
                  </p>
                </div>
              </div>
              
              <div className="z-10 flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 px-4 py-2 rounded-xl text-emerald-300 font-bold text-sm">
                <Award size={18} />
                <span>Top Performer!</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Customers" value={stats.customers} icon={Users} color="bg-blue-500" />
        <StatCard title="Active Franchises" value={stats.franchises} icon={Store} color="bg-amber-500" />
        <StatCard title="Cars Serviced Today" value={completed} icon={Car} color="bg-dryft-beige" />
        <StatCard title="Pending Stock" value={stats.stock} icon={Box} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-white">Car Wash Activity</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg text-xs px-2 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="glass-panel p-6 flex flex-col">
          <h3 className="font-bold text-white mb-6">Recent Alerts</h3>
          <div className="space-y-6 flex-1">
            <div className="text-center py-8 text-white/40 text-sm">
              <p>No recent alerts.</p>
            </div>
          </div>
          <Link 
            href="/notifications"
            className="mt-8 w-full py-2 border border-white/5 rounded-lg text-xs font-medium text-white/40 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2 group"
          >
            View All Notifications
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
