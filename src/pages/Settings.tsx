import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';

export default function Settings() {
  const { mosqueProfile, setMosqueProfile } = useAppContext();
  const [formData, setFormData] = useState(mosqueProfile);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMosqueProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="md:hidden">
        <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Pengaturan</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Profil Entitas (Masjid)</h3>
          <p className="text-xs text-slate-500 mt-1">
            Data ini akan ditampilkan pada kop laporan ISAK 35.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Nama Masjid <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
              placeholder="Contoh: Masjid Al-Ikhlas"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Alamat Lengkap <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm resize-none"
              placeholder="Contoh: Jl. Sudirman No. 1, Jakarta"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Nomor Telepon / Kontak
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
              placeholder="Contoh: 0812-3456-7890"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-4">
            {isSaved && (
              <span className="text-emerald-600 text-xs font-medium bg-emerald-50 px-3 py-1 rounded">
                Tersimpan!
              </span>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded hover:bg-emerald-700 transition-colors"
            >
              Simpan Profil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
