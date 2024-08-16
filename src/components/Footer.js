import React from 'react';
import { NavLink } from 'react-router-dom';
import './Footer.css'; // Tạo file CSS để thiết kế cho footer nếu cần

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-links">
                    <NavLink to="/about" className="footer-link">About</NavLink>
                    <NavLink to="/contact" className="footer-link">Contact</NavLink>
                    <NavLink to="/privacy-policy" className="footer-link">Privacy Policy</NavLink>
                    <NavLink to="/terms-of-service" className="footer-link">Terms of Service</NavLink>
                </div>
                <div className="footer-social">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2023 JLPTKAITOU. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
