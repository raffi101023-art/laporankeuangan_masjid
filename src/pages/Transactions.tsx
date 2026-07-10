import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { formatRupiah, formatDate } from '../utils';
import { CATEGORIES, TransactionType } from '../types';
import { Plus, Trash2, X } from 'lucide-react';

export default function Transactions() {
  const { transactions, addTransaction, deleteTransaction, selectedMonth, setSelectedMonth } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('income');
  const [categoryId, setCategoryId] = useState('');

  const filteredCategories = CATEGORIES.filter(c => c.type === type);

  // Set default category when type changes
  React.useEffect(() => {
    if (filteredCategories.length > 0 && !filteredCategories.find(c => c.id === categoryId)) {
      setCategoryId(filteredCategories[0].id);
    }
  }, [type, filteredCategories, categoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !categoryId) return;

    addTransaction({
      date,
      description,
      amount: Number(amount),
      categoryId
    });

    setIsAdding(false);
    setDescription('');
    setAmount('');
  };

  const displayedTransactions = transactions.filter(t => t.date.substring(0, 7) === selectedMonth);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="md:hidden flex items-center justify-between w-full">
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Data Transaksi</h2>
          <div className="flex items-center bg-blue-50 rounded px-2 py-1 border border-blue-100">
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-blue-700 text-xs font-bold outline-none cursor-pointer"
            />
          </div>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700 transition-colors shadow-sm ml-auto"
        >
          <Plus className="w-4 h-4 mr-1" />
          Catat Transaksi
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Transaksi Baru</h3>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Jenis Transaksi</label>
                <div className="flex rounded shadow-sm">
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-l border ${type === 'income' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 z-10' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                  >
                    Pemasukan
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-r border-y border-r ${type === 'expense' ? 'bg-rose-50 border-rose-500 text-rose-700 z-10' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                  >
                    Pengeluaran
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Kategori (Berdasarkan ISAK 35)</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded border-slate-300 border px-3 py-1.5 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  {filteredCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.restriction === 'dengan_pembatasan' ? 'Terikat' : 'Tidak Terikat'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tanggal</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded border-slate-300 border px-3 py-1.5 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Keterangan</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Cth: Kotak Amal Jumat, Listrik Bulan Ini..."
                  className="w-full rounded border-slate-300 border px-3 py-1.5 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Jumlah (Rp)</label>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full rounded border-slate-300 border px-3 py-1.5 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full md:w-auto px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Simpan Transaksi
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Semua Transaksi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-[10px] font-bold text-slate-400 text-left px-5 py-3 uppercase tracking-tighter">Tanggal</th>
                <th className="text-[10px] font-bold text-slate-400 text-left px-5 py-3 uppercase tracking-tighter">Keterangan</th>
                <th className="text-[10px] font-bold text-slate-400 text-left px-5 py-3 uppercase tracking-tighter">Kategori</th>
                <th className="text-[10px] font-bold text-slate-400 text-left px-5 py-3 uppercase tracking-tighter">Jenis Dana</th>
                <th className="text-[10px] font-bold text-slate-400 text-right px-5 py-3 uppercase tracking-tighter">Pemasukan</th>
                <th className="text-[10px] font-bold text-slate-400 text-right px-5 py-3 uppercase tracking-tighter">Pengeluaran</th>
                <th className="text-[10px] font-bold text-slate-400 text-center px-5 py-3 uppercase tracking-tighter">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-xs text-slate-500 italic">
                    Belum ada data transaksi untuk periode ini.
                  </td>
                </tr>
              ) : (
                displayedTransactions.map((tx) => {
                  const category = CATEGORIES.find(c => c.id === tx.categoryId);
                  const isIncome = category?.type === 'income';
                  
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 text-xs text-slate-600">{formatDate(tx.date)}</td>
                      <td className="px-5 py-3 text-xs font-medium text-slate-800">{tx.description}</td>
                      <td className="px-5 py-3 text-[10px] uppercase font-bold text-slate-500 italic">{category?.name}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
                          category?.restriction === 'dengan_pembatasan' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {category?.restriction === 'dengan_pembatasan' ? 'Dengan Pembatas' : 'Tanpa Pembatas'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-right font-bold text-emerald-600">
                        {isIncome ? formatRupiah(tx.amount) : '-'}
                      </td>
                      <td className="px-5 py-3 text-xs text-right font-bold text-rose-600">
                        {!isIncome ? formatRupiah(tx.amount) : '-'}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
