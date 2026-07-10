import React from 'react';
import { AppProvider, useAppContext } from './store/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function MainRouter() {
  const { currentPath } = useAppContext();

  let CurrentView = Dashboard;
  switch (currentPath) {
    case 'dashboard':
      CurrentView = Dashboard;
      break;
    case 'transactions':
      CurrentView = Transactions;
      break;
    case 'reports':
      CurrentView = Reports;
      break;
    case 'settings':
      CurrentView = Settings;
      break;
  }

  return (
    <Layout>
      <CurrentView />
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
