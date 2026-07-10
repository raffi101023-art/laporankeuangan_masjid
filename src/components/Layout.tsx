import React from 'react';
import { LayoutDashboard, Wallet, FileText, Settings } from 'lucide-react';
import { cn } from '../utils';
import { useAppContext } from '../store/AppContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { currentPath, navigate, selectedMonth, setSelectedMonth, mosqueProfile, isLoading } = useAppContext();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-emerald-200 text-sm font-medium">Memuat data dari server...</p>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transaksi', icon: Wallet },
    { id: 'reports', label: 'Laporan ISAK 35', icon: FileText },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-emerald-900 text-emerald-50 hidden md:flex flex-col border-r border-emerald-800">
        <div className="p-6 border-b border-emerald-800/50">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white text-xs font-bold">
              {mosqueProfile.name.charAt(0)}
            </div>
            {mosqueProfile.name}
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-emerald-400 mt-1 font-semibold">Standar ISAK 35</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 mt-2">
          <div className="text-[10px] uppercase font-bold text-emerald-500 mb-2 ml-2 mt-2">Menu Utama</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left",
                  isActive 
                    ? "bg-emerald-800 text-white" 
                    : "text-emerald-100 hover:bg-emerald-800/50"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-emerald-300" : "text-emerald-400")} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-emerald-800/50">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-emerald-700"></div>
            <div>
              <div className="text-xs font-semibold text-white">Admin Masjid</div>
              <div className="text-[10px] text-emerald-400">SIAM ISAK 35</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-emerald-900 p-4 flex justify-between items-center text-white">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center text-white text-xs font-bold">
              {mosqueProfile.name.charAt(0)}
            </div>
            {mosqueProfile.name}
          </h1>
        </header>

        {/* Mobile Nav */}
        <div className="md:hidden bg-emerald-800 flex overflow-x-auto">
           {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={cn(
                  "flex-1 px-4 py-3 text-xs uppercase tracking-wider font-bold whitespace-nowrap text-center transition-colors",
                  currentPath === item.id ? "bg-emerald-900 text-white" : "text-emerald-200"
                )}
              >
                {item.label}
              </button>
           ))}
        </div>

        {/* Top Header Placeholder for Desktop */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-8 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800 capitalize">
               {currentPath.replace('-', ' ')}
            </h2>
            <div className="flex items-center bg-blue-50 rounded px-2 py-1 border border-blue-100">
              <span className="text-[10px] font-bold text-blue-600 uppercase mr-2">Periode:</span>
              <input 
                type="month" 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-blue-700 text-xs font-bold outline-none cursor-pointer"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700 transition-colors" onClick={() => navigate('transactions')}>+ Catat Transaksi</button>
             <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded hover:bg-slate-50 italic transition-colors" onClick={() => navigate('reports')}>Lihat Laporan</button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
