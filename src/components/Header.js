import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

const Header = ({ isLoggedIn, username, roles, handleLogout }) => {
    const [theme, setTheme] = useState('light');
  
    useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
  
    const handleThemeSwitch = () => {
      setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };    
    
    const getUserIcon = () => {
        if (roles.includes('Admin')) {
            return <i className="fas fa-user-shield"></i>;
        } else if (roles.includes('Teacher')) {
            return <i className="fas fa-chalkboard-teacher"></i>;
        } else {
            return <i className="fas fa-user-graduate"></i>;
        }
    };

    return (
        <Navbar collapseOnSelect expand="lg" className="header">
            <Container>
                <Navbar.Brand as={NavLink} to="/" className="site-name">
                    <div className="logo-container">
                        <img src="/img/graduation-hat.png" alt="Logo" className="logo" />
                        JLPTKAITOU
                    </div>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto nav-menu">
                        <Nav.Link
                            as={NavLink}
                            to="/"
                            end
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            Home
                        </Nav.Link>
                        <Nav.Link
                            as={NavLink}
                            to="/about"
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            About
                        </Nav.Link>
                        <Nav.Link
                            as={NavLink}
                            to="/blog"
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            Blogs
                        </Nav.Link>
                        <Nav.Link
                            as={NavLink}
                            to="/portfolio"
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            Portfolio
                        </Nav.Link>
                        <Nav.Link
                            as={NavLink}
                            to="/contact"
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            Contact
                        </Nav.Link>
                    </Nav>
                    <Form.Switch 
            id="theme-switch" 
            label={theme === 'light' ? 'Light Mode' : 'Dark Mode'} 
            checked={theme === 'dark'} 
            onChange={handleThemeSwitch} 
            className="ml-auto"
          />
                    <Nav className="auth-con">
                        {!isLoggedIn ? (
                            <>
                                <Nav.Link
                                    as={NavLink}
                                    to="/register"
                                    className={({ isActive }) => (isActive ? 'active' : '')}
                                >
                                    Đăng ký
                                </Nav.Link>
                                <Nav.Link
                                    as={NavLink}
                                    to="/login"
                                    className={({ isActive }) => (isActive ? 'active' : '')}
                                >
                                    Đăng nhập
                                </Nav.Link>
                            </>
                        ) : (
                            <NavDropdown 
                                title={
                                    <div className="user-info">
                                        <span className="username">{username}</span>
                                        <div className="user-icon-wrapper">
                                            {getUserIcon()}
                                        </div>
                                    </div>
                                } 
                                id="collasible-nav-dropdown" 
                                align="end"
                            >
                                {roles.includes('Admin') && (
                                    <NavDropdown.Item as={NavLink} to="/admin/dashboard">Dashboard</NavDropdown.Item>
                                )}
                                {roles.includes('Teacher') && (
                                    <NavDropdown.Item as={NavLink} to="/teacher/manage">Manage</NavDropdown.Item>
                                )}
                                {!roles.includes('Admin') && !roles.includes('Teacher') && (
                                    <NavDropdown.Item as={NavLink} to="/user/profile">Profile</NavDropdown.Item>
                                )}
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
