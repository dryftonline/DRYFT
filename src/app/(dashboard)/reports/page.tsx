'use client';

import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  Filter,
  DollarSign,
  Users,
  Car,
  ChevronDown
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement,
  LineElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ReportCard = ({ title, value, subValue, trend, trendType, icon: Icon }: any) => (
  <div className="glass-panel p-6">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl bg-white/5 text-dryft-beige">
        <Icon size={20} />
      </div>
      {trend && (
        <span className={cn(
          "text-xs font-medium flex items-center gap-1 px-2 py-1 rounded-full",
          trendType === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
        )}>
          {trendType === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </span>
      )}
    </div>
    <p className="text-white/40 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
    <p className="text-xs text-white/20 mt-2">{subValue}</p>
  </div>
);

export default function Reports() {
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        backgroundColor: 'rgba(209, 199, 183, 0.8)',
        borderRadius: 8,
      },
    ],
  };

  const activityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        fill: true,
        label: 'Services',
        data: [65, 59, 80, 81, 56, 95, 120],
        borderColor: '#d1c7b7',
        backgroundColor: 'rgba(209, 199, 183, 0.05)',
        tension: 0.4,
      },
    ],
  };

  const commonOptions = {
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
          <h1 className="text-2xl font-bold text-white">Business Intelligence</h1>
          <p className="text-white/40 text-sm">Detailed performance analysis and revenue reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white flex items-center gap-2 transition-all">
            <Calendar size={18} />
            <span>This Month</span>
            <ChevronDown size={14} />
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download size={18} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard 
          title="Total Revenue" 
          value="$124,592" 
          subValue="vs $110,200 last month" 
          trend="+14%" 
          trendType="up" 
          icon={DollarSign} 
        />
        <ReportCard 
          title="Total Services" 
          value="1,482" 
          subValue="vs 1,240 last month" 
          trend="+8.5%" 
          trendType="up" 
          icon={Car} 
        />
        <ReportCard 
          title="New Customers" 
          value="+248" 
          subValue="vs +210 last month" 
          trend="+12%" 
          trendType="up" 
          icon={Users} 
        />
        <ReportCard 
          title="Avg. Ticket" 
          value="$84.00" 
          subValue="vs $88.50 last month" 
          trend="-5%" 
          trendType="down" 
          icon={BarChart3} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-white">Revenue Growth</h3>
              <p className="text-xs text-white/40">Monthly revenue comparison</p>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-lg text-white/40"><Filter size={16} /></button>
          </div>
          <div className="h-[300px]">
            <Bar data={revenueData} options={commonOptions} />
          </div>
        </div>

        {/* Activity Chart */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-white">Service Activity</h3>
              <p className="text-xs text-white/40">Weekly car wash frequency</p>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-lg text-white/40"><Filter size={16} /></button>
          </div>
          <div className="h-[300px]">
            <Line data={activityData} options={commonOptions} />
          </div>
        </div>
      </div>

      {/* Top Franchises */}
      <div className="glass-panel p-6">
        <h3 className="font-bold text-white mb-6">Top Performing Franchises</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Franchise Name</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Services</th>
                <th className="px-6 py-4 font-semibold">Revenue</th>
                <th className="px-6 py-4 font-semibold">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {[
                { name: 'Downtown Branch', loc: 'City Center', services: 450, rev: '$38,250', growth: '+12.5%' },
                { name: 'Uptown Premium', loc: 'North Side', services: 380, rev: '$32,300', growth: '+15.2%' },
                { name: 'Westside Auto', loc: 'West Square', services: 320, rev: '$25,600', growth: '+8.4%' },
                { name: 'Eastbay Wash', loc: 'Harbor District', services: 280, rev: '$22,400', growth: '+5.1%' },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                  <td className="px-6 py-4 text-white/60">{item.loc}</td>
                  <td className="px-6 py-4 text-white/60">{item.services}</td>
                  <td className="px-6 py-4 text-white/60">{item.rev}</td>
                  <td className="px-6 py-4 text-emerald-500 font-bold">{item.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
