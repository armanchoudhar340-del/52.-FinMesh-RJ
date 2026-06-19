import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import DashboardLayout from './layouts/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Dashboard from './pages/Dashboard';
import WalletTracker from './pages/WalletTracker';
import UndoLog from './pages/UndoLog';
import SettlementQueue from './pages/SettlementQueue';
import AccountChecker from './pages/AccountChecker';
import TradeSorter from './pages/TradeSorter';
import PriceHub from './pages/PriceHub';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import ApiKeys from './pages/ApiKeys';

// Protected Route Guard Component
function ProtectedRoute() {
  const token = localStorage.getItem('finmesh_demo_session');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <div className="app-bg">
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="wallets" element={<WalletTracker />} />
                  <Route path="undo-log" element={<UndoLog />} />
                  <Route path="queue" element={<SettlementQueue />} />
                  <Route path="checker" element={<AccountChecker />} />
                  <Route path="sorter" element={<TradeSorter />} />
                  <Route path="price-hub" element={<PriceHub />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="api-keys" element={<ApiKeys />} />
                </Route>
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}

