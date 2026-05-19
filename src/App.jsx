import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SavedReports from './pages/SavedReports';
import Templates from './pages/Templates';
import CreateReport from './pages/CreateReport';
import AuditForm from './pages/AuditForm';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import AppLayout from './components/layout/AppLayout';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1e293b',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '12px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '12px 20px',
          },
        }}
      />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/all-reports" element={<SavedReports />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/create-report" element={<CreateReport />} />
            <Route path="/add" element={<AuditForm />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;