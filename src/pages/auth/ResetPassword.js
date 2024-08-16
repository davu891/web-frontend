import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Auth.css';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const apiBaseURL = process.env.REACT_APP_API_BASE_URL;
            const response = await axios.post(`${apiBaseURL}/api/auth/reset-password/${token}`, { password });
            if (response.data) {
                setMessage(response.data.message);
            } else {
                setMessage('Unexpected response format');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="auth-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleResetPassword}>
                <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
