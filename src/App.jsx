import { useState, useEffect } from 'react';
import { Hero, Dashboard, LogSleepForm, LoginForm, RegisterForm } from './pages';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import './App.css';

const AppRoutes = ({ user, onLogin, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <Routes>
      <Route path="/" element={<Hero user={user} />} />
      <Route path="/login" element={<LoginForm onLogin={onLogin} />} />
      <Route path="/register" element={<RegisterForm onRegister={onLogin} />} />
      <Route
        path="/dashboard"
        element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // new loading state

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoadingUser(false); // done loading regardless
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  //Show nothing while checking localStorage to avoid redirect flashes
  if (loadingUser) return null;

  return (
    <Router>
      <AppRoutes user={user} onLogin={handleLogin} onLogout={handleLogout} />
    </Router>
  );
};

export default App;
