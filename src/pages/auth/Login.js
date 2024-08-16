import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import { jwtDecode } from 'jwt-decode'; // Correct import statement for named export

import './Auth.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

// Trong Login.js
const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await axiosInstance.post('/auth/login', { email, password });
        console.log('Response from server:', response.data);
        if (response.data && response.data.token) {
            const roles = response.data.roles || [];

            if (!Array.isArray(roles)) {
                console.error('Invalid roles format:', roles);
            } else {
                const decoded = jwtDecode(response.data.token);
                const userId = decoded.userId;

                setMessage('Login successful');
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', userId);
                localStorage.setItem('roles', JSON.stringify(roles));
                onLogin(email, response.data.token, userId, roles);
            }
        } else {
            setMessage('Unexpected response format');
        }
    } catch (error) {
        console.error('Login error:', error);
        setMessage('An error occurred. Please try again.');
    }
};


    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
