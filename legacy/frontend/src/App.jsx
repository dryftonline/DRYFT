import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MainLayout from './layouts/MainLayout';
import Customers from './pages/Customers';
import Franchises from './pages/Franchises';
import StockUpdates from './pages/StockUpdates';
import Notifications from './pages/Notifications';
import UserManagement from './pages/UserManagement';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="franchises" element={<Franchises />} />
          <Route path="stock" element={<StockUpdates />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="reports" element={<div className="p-8">Reports Placeholder</div>} />
          <Route path="settings" element={<div className="p-8">Settings Placeholder</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
