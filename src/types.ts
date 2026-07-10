export interface MosqueProfile {
  name: string;
  address: string;
  phone?: string;
}

export type TransactionType = 'income' | 'expense';

export type RestrictionType = 'tanpa_pembatasan' | 'dengan_pembatasan';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  restriction: RestrictionType;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  categoryId: string;
}

export const CATEGORIES: Category[] = [
  // Pemasukan
  { id: 'inc_infaq_umum', name: 'Infaq / Shadaqah Umum', type: 'income', restriction: 'tanpa_pembatasan' },
  { id: 'inc_zakat', name: 'Zakat Fitrah & Maal', type: 'income', restriction: 'dengan_pembatasan' },
  { id: 'inc_wakaf', name: 'Wakaf Pembangunan', type: 'income', restriction: 'dengan_pembatasan' },
  { id: 'inc_yatim', name: 'Infaq Anak Yatim', type: 'income', restriction: 'dengan_pembatasan' },
  { id: 'inc_lain', name: 'Penerimaan Lain-lain', type: 'income', restriction: 'tanpa_pembatasan' },
  
  // Pengeluaran
  { id: 'exp_operasional', name: 'Operasional Masjid (Listrik, Air, dll)', type: 'expense', restriction: 'tanpa_pembatasan' },
  { id: 'exp_honor', name: 'Honor Pengurus & Imam', type: 'expense', restriction: 'tanpa_pembatasan' },
  { id: 'exp_kegiatan', name: 'Kegiatan Kajian / Umum', type: 'expense', restriction: 'tanpa_pembatasan' },
  { id: 'exp_zakat', name: 'Penyaluran Zakat', type: 'expense', restriction: 'dengan_pembatasan' },
  { id: 'exp_yatim', name: 'Penyaluran Santunan Yatim', type: 'expense', restriction: 'dengan_pembatasan' },
  { id: 'exp_pembangunan', name: 'Biaya Pembangunan', type: 'expense', restriction: 'dengan_pembatasan' },
];
