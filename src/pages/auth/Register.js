import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

// Lấy URL gốc từ biến môi trường
const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Sử dụng hook useNavigate để chuyển hướng

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(`${apiBaseURL}/api/auth/register`, { username, email, password });
            if (response.data) {
                setMessage(response.data.message);
                // Chuyển hướng người dùng đến trang đăng nhập sau khi đăng ký thành công
                navigate('/login');
            } else {
                setMessage('Unexpected response format');
            }
        } catch (error) {
            console.error('Registration error:', error); // Log lỗi để debug
            if (error.response && error.response.data) {
                setMessage(error.response.data.message + ' ' + error.response.data.error);
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
