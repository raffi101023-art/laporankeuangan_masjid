import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, MosqueProfile } from '../types';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

interface AppContextType {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  currentPath: string;
  navigate: (path: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  mosqueProfile: MosqueProfile;
  setMosqueProfile: (profile: MosqueProfile) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_PROFILE: MosqueProfile = {
  name: 'Masjid Al-Ikhlas',
  address: 'Jl. Contoh Alamat No. 123, Kota',
  phone: '0812-3456-7890',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mosqueProfile, setMosqueProfileState] = useState<MosqueProfile>(DEFAULT_PROFILE);
  const [currentPath, setCurrentPath] = useState<string>('dashboard');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => new Date().toISOString().substring(0, 7));
  const [isLoading, setIsLoading] = useState(true);

  // Listen to transactions from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txList: Transaction[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Transaction, 'id'>),
      }));
      setTransactions(txList);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching transactions:', error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load mosque profile from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileDoc = await getDoc(doc(db, 'settings', 'profile'));
        if (profileDoc.exists()) {
          setMosqueProfileState(profileDoc.data() as MosqueProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const setMosqueProfile = async (profile: MosqueProfile) => {
    setMosqueProfileState(profile);
    try {
      await setDoc(doc(db, 'settings', 'profile'), profile);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
    try {
      await addDoc(collection(db, 'transactions'), tx);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const navigate = (path: string) => {
    setCurrentPath(path);
  };

  return (
    <AppContext.Provider value={{
      transactions,
      addTransaction,
      deleteTransaction,
      currentPath,
      navigate,
      selectedMonth,
      setSelectedMonth,
      mosqueProfile,
      setMosqueProfile,
      isLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
