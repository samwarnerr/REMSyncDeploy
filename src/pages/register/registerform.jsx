import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../login/loginform.css';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('https://remsyncdeploybackend-production.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        onRegister(data.user);
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        alert(data.error || 'Registration failed');
        setLoading(false);
      }
    } catch (err) {
      console.error('Register error', err);
      alert('Something went wrong');
      setLoading(false);
    }
  };

  if (loading && success) {
    return (
      <div className='login-wrapper'>
        <div className='auth-card'>
          <div className='success-container'>
        <div className="moon-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="#A5D7E8" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
          </div>
            <h2>Welcome, {formData.name}!</h2>
            <p>Redirecting to your dashboard...</p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className='login-wrapper'>
      <div className="auth-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label>Name
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>Email
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>Password
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
          <p className='signup-link'>
                Already have an account? <Link to="/login" className='signup-btn'>Sign in</Link>
            </p>
      </div>
    </div>
  );
};

export default Register;
