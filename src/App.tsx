import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Toaster } from './components/ui/sonner';
import { Navbar, Footer } from './components/Layout';
import { Loader2 } from 'lucide-react';

// Lazy load pages for performance
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const Marketplace = lazy(() => import('./pages/Marketplace').then(m => ({ default: m.Marketplace })));
const UserDashboard = lazy(() => import('./pages/UserDashboard').then(m => ({ default: m.UserDashboard })));
const FundiDashboard = lazy(() => import('./pages/FundiDashboard').then(m => ({ default: m.FundiDashboard })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const JobPostPage = lazy(() => import('./pages/JobPostPage').then(m => ({ default: m.JobPostPage })));
const ChatPage = lazy(() => import('./pages/ChatPage').then(m => ({ default: m.ChatPage })));
const PaymentCheckout = lazy(() => import('./pages/PaymentCheckout').then(m => ({ default: m.PaymentCheckout })));

const LoadingFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
    <div className="w-16 h-16 rounded-3xl bg-white shadow-premium flex items-center justify-center mb-6 animate-bounce">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Tuma Fundi...</p>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { currentUser, isGracePeriodActive } = useStore();
  
  if (!currentUser) return <Navigate to="/auth" />;
  if (currentUser.role === 'fundi' && !isGracePeriodActive(currentUser)) return <Navigate to="/dashboard" />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) return <Navigate to="/" />;
  
  return <>{children}</>;
};

const DashboardRedirect = () => {
  const { currentUser } = useStore();
  if (currentUser?.role === 'fundi') return <FundiDashboard />;
  if (currentUser?.role === 'admin') return <AdminDashboard />;
  return <UserDashboard />;
};

function App() {
  return (
    <StoreProvider>
      <Router>
        <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-primary/20">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/post-job" element={
                  <ProtectedRoute>
                    <JobPostPage />
                  </ProtectedRoute>
                } />
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardRedirect />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={<PaymentCheckout />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <Toaster position="top-center" richColors />
        </div>
      </Router>
    </StoreProvider>
  );
}

export default App;