import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { formatRupiah } from '../utils';
import { CATEGORIES } from '../types';

export default function Reports() {
  const { transactions, selectedMonth, setSelectedMonth, mosqueProfile } = useAppContext();
  const [activeTab, setActiveTab] = useState('posisi-keuangan');
  const [reportType, setReportType] = useState<'month' | 'year'>('month');

  const componentRef = useRef<HTMLDivElement>(null);
  
  const tabs = [
    { id: 'posisi-keuangan', label: 'Posisi Keuangan' },
    { id: 'penghasilan-komprehensif', label: 'Penghasilan Komprehensif' },
    { id: 'perubahan-aset-neto', label: 'Perubahan Aset Neto' },
    { id: 'arus-kas', label: 'Arus Kas' },
  ];

  const selectedYear = selectedMonth.substring(0, 4);

  const isUpToPeriod = (dateStr: string) => {
    if (reportType === 'month') return dateStr.substring(0, 7) <= selectedMonth;
    return dateStr.substring(0, 4) <= selectedYear;
  };
  const isBeforePeriod = (dateStr: string) => {
    if (reportType === 'month') return dateStr.substring(0, 7) < selectedMonth;
    return dateStr.substring(0, 4) < selectedYear;
  };
  const isInPeriod = (dateStr: string) => {
    if (reportType === 'month') return dateStr.substring(0, 7) === selectedMonth;
    return dateStr.substring(0, 4) === selectedYear;
  };

  const calculateNet = (txs: any[]) => {
     let unrestrictedIncome = 0;
     let restrictedIncome = 0;
     let unrestrictedExpense = 0;
     let restrictedExpense = 0;

     CATEGORIES.forEach(c => {
       const total = txs.filter((t: any) => t.categoryId === c.id).reduce((sum: number, t: any) => sum + t.amount, 0);
       if (c.type === 'income') {
         if (c.restriction === 'tanpa_pembatasan') unrestrictedIncome += total;
         else restrictedIncome += total;
       } else {
         if (c.restriction === 'tanpa_pembatasan') unrestrictedExpense += total;
         else restrictedExpense += total;
       }
     });

     return {
       unrestrictedIncome, restrictedIncome, unrestrictedExpense, restrictedExpense,
       unrestrictedNet: unrestrictedIncome - unrestrictedExpense,
       restrictedNet: restrictedIncome - restrictedExpense,
       totalNet: (unrestrictedIncome - unrestrictedExpense) + (restrictedIncome - restrictedExpense)
     };
  };

  const currentPeriodTxs = transactions.filter(t => isInPeriod(t.date));
  const previousPeriodTxs = transactions.filter(t => isBeforePeriod(t.date));
  const upToPeriodTxs = transactions.filter(t => isUpToPeriod(t.date));

  const currentPeriodData = calculateNet(currentPeriodTxs);
  const previousPeriodData = calculateNet(previousPeriodTxs);
  const upToPeriodData = calculateNet(upToPeriodTxs);

  const getCategoryTotal = (categoryId: string) => 
    currentPeriodTxs.filter(t => t.categoryId === categoryId).reduce((sum, t) => sum + t.amount, 0);

  const periodLabel = reportType === 'month' 
    ? new Date(selectedMonth + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    : selectedYear;

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Laporan_ISAK_35_${periodLabel}`,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="md:hidden flex items-center justify-between w-full">
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Pelaporan ISAK 35</h2>
          <div className="flex items-center bg-blue-50 rounded px-2 py-1 border border-blue-100">
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-blue-700 text-xs font-bold outline-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto ml-auto">
          <div className="flex bg-slate-200/50 p-1 rounded-lg w-full sm:w-auto border border-slate-200">
            <button 
              onClick={() => setReportType('month')}
              className={`flex-1 sm:flex-none px-6 py-1.5 text-xs font-bold rounded-md transition-all ${reportType === 'month' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Bulanan
            </button>
            <button 
              onClick={() => setReportType('year')}
              className={`flex-1 sm:flex-none px-6 py-1.5 text-xs font-bold rounded-md transition-all ${reportType === 'year' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Tahunan
            </button>
          </div>
          <button 
            onClick={() => handlePrint()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition-colors whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak PDF</span>
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-2 px-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-x-auto">
        <div ref={componentRef} className="min-w-[600px] p-8 bg-white">
          {activeTab === 'posisi-keuangan' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-slate-900">{mosqueProfile.name}</h2>
                <p className="text-xs text-slate-500 mt-1 mb-4 max-w-sm mx-auto leading-relaxed">{mosqueProfile.address}{mosqueProfile.phone ? ` • Telp: ${mosqueProfile.phone}` : ''}</p>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Laporan Posisi Keuangan</h3>
                <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Per Akhir Periode {periodLabel}</p>
              </div>

              <table className="w-full text-xs text-slate-700">
                <tbody>
                  <tr className="font-bold text-slate-900 bg-slate-50 border-y border-slate-200"><td className="py-2 px-4" colSpan={2}>ASET</td></tr>
                  <tr><td className="py-2 pl-6 font-medium">Aset Lancar</td><td></td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2 pl-10 text-slate-600">Kas dan Setara Kas</td><td className="py-2 px-4 text-right">{formatRupiah(upToPeriodData.totalNet)}</td></tr>
                  <tr className="font-bold text-slate-900 border-b border-slate-200"><td className="py-2 pl-6">TOTAL ASET</td><td className="py-2 px-4 text-right">{formatRupiah(upToPeriodData.totalNet)}</td></tr>
                  
                  <tr><td className="py-3" colSpan={2}></td></tr>

                  <tr className="font-bold text-slate-900 bg-slate-50 border-y border-slate-200"><td className="py-2 px-4" colSpan={2}>LIABILITAS</td></tr>
                  <tr className="border-b border-slate-200 font-bold text-slate-900"><td className="py-2 pl-6">Total Liabilitas</td><td className="py-2 px-4 text-right">{formatRupiah(0)}</td></tr>

                  <tr><td className="py-3" colSpan={2}></td></tr>

                  <tr className="font-bold text-slate-900 bg-slate-50 border-y border-slate-200"><td className="py-2 px-4" colSpan={2}>ASET NETO</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2 pl-6 text-slate-600">Tanpa Pembatasan dari Pemberi Sumber Daya</td><td className="py-2 px-4 text-right">{formatRupiah(upToPeriodData.unrestrictedNet)}</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-2 pl-6 text-slate-600">Dengan Pembatasan dari Pemberi Sumber Daya</td><td className="py-2 px-4 text-right">{formatRupiah(upToPeriodData.restrictedNet)}</td></tr>
                  <tr className="font-bold text-slate-900 border-b-2 border-slate-800"><td className="py-2 pl-6">TOTAL ASET NETO</td><td className="py-2 px-4 text-right">{formatRupiah(upToPeriodData.totalNet)}</td></tr>
                  
                  <tr className="font-bold text-slate-900 bg-slate-100 border-b-4 border-double border-slate-800 mt-4"><td className="py-3 px-4">TOTAL LIABILITAS DAN ASET NETO</td><td className="py-3 px-4 text-right text-sm">{formatRupiah(upToPeriodData.totalNet)}</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'penghasilan-komprehensif' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-slate-900">{mosqueProfile.name}</h2>
                <p className="text-xs text-slate-500 mt-1 mb-4 max-w-sm mx-auto leading-relaxed">{mosqueProfile.address}{mosqueProfile.phone ? ` • Telp: ${mosqueProfile.phone}` : ''}</p>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Laporan Penghasilan Komprehensif</h3>
                <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Periode {periodLabel}</p>
              </div>

              <table className="w-full text-xs text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200">
                    <th className="py-2 px-4 text-left font-bold text-slate-900">Uraian</th>
                    <th className="py-2 px-4 text-right font-bold text-slate-900 w-32">Tanpa Pembatasan</th>
                    <th className="py-2 px-4 text-right font-bold text-slate-900 w-32">Dengan Pembatasan</th>
                    <th className="py-2 px-4 text-right font-bold text-slate-900 w-32">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="font-bold text-slate-900 bg-slate-50/50"><td className="py-2 px-4" colSpan={4}>PENDAPATAN</td></tr>
                  {CATEGORIES.filter(c => c.type === 'income').map(c => {
                    const amount = getCategoryTotal(c.id);
                    if (amount === 0) return null;
                    const isUn = c.restriction === 'tanpa_pembatasan';
                    return (
                      <tr key={c.id}>
                        <td className="py-2 pl-8 text-slate-600">{c.name}</td>
                        <td className="py-2 px-4 text-right">{isUn ? formatRupiah(amount) : '-'}</td>
                        <td className="py-2 px-4 text-right">{!isUn ? formatRupiah(amount) : '-'}</td>
                        <td className="py-2 px-4 text-right">{formatRupiah(amount)}</td>
                      </tr>
                    );
                  })}
                  <tr className="font-bold text-slate-900 border-t border-slate-300">
                    <td className="py-2 pl-6">Total Pendapatan</td>
                    <td className="py-2 px-4 text-right">{formatRupiah(currentPeriodData.unrestrictedIncome)}</td>
                    <td className="py-2 px-4 text-right">{formatRupiah(currentPeriodData.restrictedIncome)}</td>
                    <td className="py-2 px-4 text-right">{formatRupiah(currentPeriodData.unrestrictedIncome + currentPeriodData.restrictedIncome)}</td>
                  </tr>

                  <tr><td className="py-3" colSpan={4}></td></tr>

                  <tr className="font-bold text-slate-900 bg-slate-50/50"><td className="py-2 px-4" colSpan={4}>BEBAN</td></tr>
                  {CATEGORIES.filter(c => c.type === 'expense').map(c => {
                    const amount = getCategoryTotal(c.id);
                    if (amount === 0) return null;
                    const isUn = c.restriction === 'tanpa_pembatasan';
                    return (
                      <tr key={c.id}>
                        <td className="py-2 pl-8 text-slate-600">{c.name}</td>
                        <td className="py-2 px-4 text-right text-rose-600">{isUn ? `(${formatRupiah(amount)})` : '-'}</td>
                        <td className="py-2 px-4 text-right text-rose-600">{!isUn ? `(${formatRupiah(amount)})` : '-'}</td>
                        <td className="py-2 px-4 text-right text-rose-600">({formatRupiah(amount)})</td>
                      </tr>
                    );
                  })}
                  <tr className="font-bold text-slate-900 border-t border-slate-300">
                    <td className="py-2 pl-6">Total Beban</td>
                    <td className="py-2 px-4 text-right text-rose-600">({formatRupiah(currentPeriodData.unrestrictedExpense)})</td>
                    <td className="py-2 px-4 text-right text-rose-600">({formatRupiah(currentPeriodData.restrictedExpense)})</td>
                    <td className="py-2 px-4 text-right text-rose-600">({formatRupiah(currentPeriodData.unrestrictedExpense + currentPeriodData.restrictedExpense)})</td>
                  </tr>

                  <tr className="font-bold text-slate-900 bg-slate-100 border-y-2 border-slate-800 mt-4">
                    <td className="py-3 px-4 text-sm">SURPLUS (DEFISIT)</td>
                    <td className="py-3 px-4 text-right text-sm">{formatRupiah(currentPeriodData.unrestrictedNet)}</td>
                    <td className="py-3 px-4 text-right text-sm">{formatRupiah(currentPeriodData.restrictedNet)}</td>
                    <td className="py-3 px-4 text-right text-sm">{formatRupiah(currentPeriodData.totalNet)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'perubahan-aset-neto' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-slate-900">{mosqueProfile.name}</h2>
                <p className="text-xs text-slate-500 mt-1 mb-4 max-w-sm mx-auto leading-relaxed">{mosqueProfile.address}{mosqueProfile.phone ? ` • Telp: ${mosqueProfile.phone}` : ''}</p>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Laporan Perubahan Aset Neto</h3>
                <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Periode {periodLabel}</p>
              </div>

              <table className="w-full text-xs text-slate-700">
                <tbody>
                  <tr className="font-bold text-slate-900 bg-slate-50 border-y border-slate-200"><td className="py-2 px-4" colSpan={2}>ASET NETO TANPA PEMBATASAN DARI PEMBERI SUMBER DAYA</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2 pl-8 text-slate-600">Saldo Awal</td><td className="py-2 px-4 text-right">{formatRupiah(previousPeriodData.unrestrictedNet)}</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-2 pl-8 text-slate-600">Surplus (Defisit) Periode Berjalan</td><td className="py-2 px-4 text-right">{formatRupiah(currentPeriodData.unrestrictedNet)}</td></tr>
                  <tr className="font-bold text-slate-900 border-b-2 border-slate-400"><td className="py-2 pl-6">Saldo Akhir Tanpa Pembatasan</td><td className="py-2 px-4 text-right">{formatRupiah(upToPeriodData.unrestrictedNet)}</td></tr>
                  
                  <tr><td className="py-3" colSpan={2}></td></tr>

                  <tr className="font-bold text-slate-900 bg-slate-50 border-y border-slate-200"><td className="py-2 px-4" colSpan={2}>ASET NETO DENGAN PEMBATASAN DARI PEMBERI SUMBER DAYA</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2 pl-8 text-slate-600">Saldo Awal</td><td className="py-2 px-4 text-right">{formatRupiah(previousPeriodData.restrictedNet)}</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-2 pl-8 text-slate-600">Surplus (Defisit) Periode Berjalan</td><td className="py-2 px-4 text-right">{formatRupiah(currentPeriodData.restrictedNet)}</td></tr>
                  <tr className="font-bold text-slate-900 border-b-2 border-slate-400"><td className="py-2 pl-6">Saldo Akhir Dengan Pembatasan</td><td className="py-2 px-4 text-right">{formatRupiah(upToPeriodData.restrictedNet)}</td></tr>
                  
                  <tr className="font-bold text-slate-900 bg-slate-100 border-y-2 border-slate-800 mt-4"><td className="py-3 px-4 text-sm">TOTAL ASET NETO</td><td className="py-3 px-4 text-right text-sm">{formatRupiah(upToPeriodData.totalNet)}</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'arus-kas' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-slate-900">{mosqueProfile.name}</h2>
                <p className="text-xs text-slate-500 mt-1 mb-4 max-w-sm mx-auto leading-relaxed">{mosqueProfile.address}{mosqueProfile.phone ? ` • Telp: ${mosqueProfile.phone}` : ''}</p>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Laporan Arus Kas</h3>
                <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Periode {periodLabel} (Metode Langsung)</p>
              </div>

              <table className="w-full text-xs text-slate-700">
                <tbody>
                  <tr className="font-bold text-slate-900 bg-slate-50 border-y border-slate-200"><td className="py-2 px-4" colSpan={2}>AKTIVITAS OPERASI</td></tr>
                  {CATEGORIES.filter(c => c.type === 'income').map(c => {
                    const amount = getCategoryTotal(c.id);
                    if (amount === 0) return null;
                    return <tr key={c.id} className="border-b border-slate-100"><td className="py-2 pl-8 text-slate-600">Penerimaan dari {c.name}</td><td className="py-2 px-4 text-right">{formatRupiah(amount)}</td></tr>
                  })}
                  {CATEGORIES.filter(c => c.type === 'expense').map(c => {
                    const amount = getCategoryTotal(c.id);
                    if (amount === 0) return null;
                    return <tr key={c.id} className="border-b border-slate-100"><td className="py-2 pl-8 text-slate-600">Pembayaran untuk {c.name}</td><td className="py-2 px-4 text-right text-rose-600">({formatRupiah(amount)})</td></tr>
                  })}
                  <tr className="font-bold text-slate-900 border-t border-slate-300"><td className="py-2 pl-6">Kas Neto dari Aktivitas Operasi</td><td className="py-2 px-4 text-right">{formatRupiah(currentPeriodData.totalNet)}</td></tr>

                  <tr><td className="py-3" colSpan={2}></td></tr>

                  <tr className="font-bold text-slate-900 bg-slate-100 border-y-2 border-slate-800"><td className="py-3 px-4 text-sm">KENAIKAN (PENURUNAN) NETO KAS</td><td className="py-3 px-4 text-right text-sm">{formatRupiah(currentPeriodData.totalNet)}</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-2 px-4 font-medium text-slate-600">Kas dan Setara Kas Pada Awal Periode</td><td className="py-2 px-4 text-right">{formatRupiah(previousPeriodData.totalNet)}</td></tr>
                  <tr className="font-bold text-slate-900"><td className="py-3 px-4">KAS DAN SETARA KAS PADA AKHIR PERIODE</td><td className="py-3 px-4 text-right">{formatRupiah(upToPeriodData.totalNet)}</td></tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
