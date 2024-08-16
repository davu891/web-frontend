import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

// Lấy URL gốc từ biến môi trường
const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${apiBaseURL}/api/auth/forgot-password`, { email });
            if (response.data) {
                setMessage(response.data.message);
            } else {
                setMessage('Unexpected response format');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="auth-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;
