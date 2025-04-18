import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import './loginform.css';

const Login = ({ onLogin }) => {
    
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('user', JSON.stringify(data.user)); // store user data in local storage
            onLogin(data.user); // pass user data to app state
            navigate('/dashboard');
        } else {
            alert(data.error || 'Login failed');
        }
        } catch (err) {
        console.error('Login error', err);
        alert('Something went wrong');
        }
    };

  return (
    <div className='login-wrapper'>
        <div className="auth-card">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>Email
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </label>
                <label>Password
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </label>
                <button type="submit">Log In</button>
            </form>
                <p className='signup-link'>
                Don't have an account? <Link to="/register" className='signup-btn'>Sign up</Link>
                </p>
        </div>
    </div>
  );
};

export default Login;
