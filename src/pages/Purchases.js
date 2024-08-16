import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import Swal from 'sweetalert2';


const Purchase = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');

    useEffect(() => {
        const storedTitle = sessionStorage.getItem('courseTitle');
        if (location.state && location.state.title) {
            setTitle(location.state.title);
            sessionStorage.setItem('courseTitle', location.state.title);
        } else if (storedTitle) {
            setTitle(storedTitle);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể xác định khóa học. Vui lòng thử lại.',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/');
            });
        }
    }, [location, navigate]);

    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/auth/login', { email, password });
            if (response.data) {
                localStorage.setItem('token', response.data.token);
                setIsLoggedIn(true);
            } else {
                setMessage('Unexpected response format');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response && error.response.data) {
                setMessage(error.response.data.message + ' ' + error.response.data.error);
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('/auth/register', { username, email, password });
            if (response.data) {
                const loginResponse = await axios.post('/auth/login', { email, password });
                if (loginResponse.data) {
                    localStorage.setItem('token', loginResponse.data.token);
                    setIsLoggedIn(true);
                    setIsRegistering(false);
                } else {
                    setMessage('Unexpected response format during login after registration');
                }
            } else {
                setMessage('Unexpected response format');
            }
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response && error.response.data) {
                setMessage(error.response.data.message + ' ' + error.response.data.error);
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    const handlePurchase = async () => {
        const loggedInStatus = localStorage.getItem('token');
        if (loggedInStatus) {
            const token = loggedInStatus;
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.userId;

            try {
                await axios.post(`/auth/courses/${userId}`, { courseTitle: title });
                Swal.fire({
                    icon: 'success',
                    title: 'Mua khóa học thành công',
                    text: `Bạn đã mua khóa học ${title} thành công!`,
                    confirmButtonText: 'OK'
                }).then(() => {
                    const redirectAfterPurchase = sessionStorage.getItem('redirectAfterPurchase');
                    sessionStorage.removeItem('redirectAfterPurchase');
                    navigate(redirectAfterPurchase || `/courses/learn/${title}`);
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Có lỗi xảy ra khi mua khóa học. Vui lòng thử lại.',
                    confirmButtonText: 'OK'
                });
                console.error('Error buying course:', error);
            }
        }
    };

    return (
        <div className="auth-container">
            {!isLoggedIn ? (
                <div>
                    <h2>{isRegistering ? 'Đăng ký' : 'Đăng nhập'}</h2>
                    <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                        {isRegistering && (
                            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        )}
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        {isRegistering && (
                            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        )}
                        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
                    </form>
                    {message && <p>{message}</p>}
                    <Link onClick={() => setIsRegistering(!isRegistering)}>
                        {isRegistering ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
                    </Link>
                </div>
            ) : (
                <div>
                    <h2>Mua khóa học: {title}</h2>
                    <button onClick={handlePurchase}>Mua</button>
                </div>
            )}
        </div>
    );
};

export default Purchase;