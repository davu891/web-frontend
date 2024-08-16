import React from 'react';
import { Route, Routes, NavLink } from 'react-router-dom';
import Dashboard from './Dashboard';
import Users from './Users';
import Courses from './Courses';
import Tables from './Tables';
import './Admin.css';

const Admin = () => {
    return (
        <div className="admin-container">
            <nav className="admin-sidebar">
                <ul>
                    <li>
                        <NavLink to="dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
                    </li>
                    <li>
                        <NavLink to="users" className={({ isActive }) => isActive ? 'active' : ''}>Users</NavLink>
                    </li>
                    <li>
                        <NavLink to="courses" className={({ isActive }) => isActive ? 'active' : ''}>Courses</NavLink>
                    </li>
                    <li>
                        <NavLink to="tables" className={({ isActive }) => isActive ? 'active' : ''}>Tables</NavLink>
                    </li>
                </ul>
            </nav>
            <div className="admin-content">
                <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="courses" element={<Courses />} />
                    <Route path="tables" element={<Tables />} />
                </Routes>
            </div>
        </div>
    );
}

export default Admin;
