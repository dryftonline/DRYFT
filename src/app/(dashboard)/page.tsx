'use client';

import { 
  Users, 
  Store, 
  Car, 
  Box, 
  TrendingUp, 
  Clock,
  ArrowRight
} from 'lucide-react';
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
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        fill: true,
        label: 'Cars Washed',
        data: [45, 52, 48, 70, 65, 88, 95],
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
          <p className="text-white/40 text-sm">Welcome back to DRYFT administration console.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-white/60">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          System Status: Operational
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Customers" value="2,842" icon={Users} color="bg-blue-500" trend="+12.5%" />
        <StatCard title="Active Franchises" value="18" icon={Store} color="bg-amber-500" />
        <StatCard title="Cars Today" value="95" icon={Car} color="bg-dryft-beige" trend="+8%" />
        <StatCard title="Pending Stock" value="4" icon={Box} color="bg-rose-500" />
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
            {[
              { type: 'Urgent', msg: 'Low stock: Chemical A - Downtown Branch', time: '10m ago' },
              { type: 'Info', msg: 'New franchise manager assigned - Westside', time: '1h ago' },
              { type: 'Urgent', msg: 'Pending stock approval for Uptown', time: '3h ago' },
            ].map((alert, i) => (
              <div key={i} className="flex gap-4">
                <div className={cn(
                  "w-1 h-10 rounded-full",
                  alert.type === 'Urgent' ? 'bg-rose-500' : 'bg-blue-500'
                )} />
                <div>
                  <p className="text-sm text-white/80 line-clamp-1">{alert.msg}</p>
                  <p className="text-xs text-white/30 mt-1 flex items-center gap-1">
                    <Clock size={10} /> {alert.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full py-2 border border-white/5 rounded-lg text-xs font-medium text-white/40 hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2 group">
            View All Notifications
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
