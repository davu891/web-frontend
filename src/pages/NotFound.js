import React from 'react';
import { Link } from 'react-router-dom'; // Sử dụng Link từ react-router-dom
import './notfound.css';

const NotFound = () => {
    return (
        <div>
            <div className="section">
                <h1 className="error">404</h1>
                <div className="page">Ooops!!! The page you are looking for is not found</div>
                <Link className="back-home" to="/">Back to home</Link> {/* Sử dụng Link để điều hướng */}
            </div>
        </div>
    );
}

export default NotFound;
