import React from 'react';
import { useAppContext } from '../store/AppContext';
import { formatRupiah } from '../utils';
import { CATEGORIES } from '../types';
import { ArrowDownRight, ArrowUpRight, Coins } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { transactions, selectedMonth, setSelectedMonth } = useAppContext();

  const isUpToMonth = (dateStr: string, monthStr: string) => dateStr.substring(0, 7) <= monthStr;
  const isInMonth = (dateStr: string, monthStr: string) => dateStr.substring(0, 7) === monthStr;

  const upToMonthTransactions = transactions.filter(t => isUpToMonth(t.date, selectedMonth));
  const currentMonthTransactions = transactions.filter(t => isInMonth(t.date, selectedMonth));

  // Net Balance is cumulative
  const totalIncomeCumulative = upToMonthTransactions
    .filter(t => CATEGORIES.find(c => c.id === t.categoryId)?.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenseCumulative = upToMonthTransactions
    .filter(t => CATEGORIES.find(c => c.id === t.categoryId)?.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncomeCumulative - totalExpenseCumulative;

  // Monthly stats for the cards
  const totalIncome = currentMonthTransactions
    .filter(t => CATEGORIES.find(c => c.id === t.categoryId)?.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = currentMonthTransactions
    .filter(t => CATEGORIES.find(c => c.id === t.categoryId)?.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Group by month for the chart (last 6 months up to selected)
  const monthlyDataMap: Record<string, { income: number; expense: number }> = {};
  
  upToMonthTransactions.forEach(t => {
    const month = t.date.substring(0, 7); // YYYY-MM
    if (!monthlyDataMap[month]) {
      monthlyDataMap[month] = { income: 0, expense: 0 };
    }
    const isIncome = CATEGORIES.find(c => c.id === t.categoryId)?.type === 'income';
    if (isIncome) {
      monthlyDataMap[month].income += t.amount;
    } else {
      monthlyDataMap[month].expense += t.amount;
    }
  });

  const chartData = Object.keys(monthlyDataMap).sort().map(month => ({
    name: month,
    Pemasukan: monthlyDataMap[month].income,
    Pengeluaran: monthlyDataMap[month].expense,
  })).slice(-6); // Last 6 months

  return (
    <div className="space-y-6">
      <div className="md:hidden flex items-center justify-between w-full">
        <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Dashboard</h2>
        <div className="flex items-center bg-blue-50 rounded px-2 py-1 border border-blue-100">
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent text-blue-700 text-xs font-bold outline-none cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="md:col-span-2 bg-white p-4 border border-slate-200 rounded-lg shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 flex justify-between">
            <span>Total Kas (Aset Neto)</span>
            <Coins className="w-4 h-4 text-slate-400" />
          </p>
          <div className="text-2xl font-bold text-emerald-700 tracking-tight">{formatRupiah(netBalance)}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">Seluruh rekening & kas tunai</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 flex justify-between">
            <span>Total Pemasukan</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          </p>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{formatRupiah(totalIncome)}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">Total Pemasukan</div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1 flex justify-between">
            <span>Total Pengeluaran</span>
            <ArrowDownRight className="w-4 h-4 text-rose-500" />
          </p>
          <div className="text-2xl font-bold text-rose-600 tracking-tight">{formatRupiah(totalExpense)}</div>
          <div className="text-[10px] text-rose-500 font-medium mt-1">Total Pengeluaran</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col p-5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Arus Kas 6 Bulan Terakhir</h3>
        </div>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} tickFormatter={(value) => `Rp ${value / 1000000}M`} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', fontSize: '12px' }}
                formatter={(value: number) => formatRupiah(value)}
              />
              <Bar dataKey="Pemasukan" fill="#10b981" radius={[2, 2, 0, 0]} maxBarSize={30} />
              <Bar dataKey="Pengeluaran" fill="#e11d48" radius={[2, 2, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
