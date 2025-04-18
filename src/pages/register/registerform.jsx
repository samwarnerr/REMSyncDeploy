import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const res = await fetch('remsyncdeploybackend-production.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        onRegister(data.user); // Set app user state
        setTimeout(() => navigate('/dashboard'), 1500); // Redirect after brief message
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
          <h2>Welcome, {formData.name}!</h2>
          <p>Redirecting to your dashboard...</p>
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
      </div>
    </div>
  );
};

export default Register;
