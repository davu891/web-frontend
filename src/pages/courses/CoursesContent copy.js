import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaBars } from 'react-icons/fa';
import './CoursesContent.css';

const CoursesContent = () => {
    const [activeMenu, setActiveMenu] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleToggle = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="courses-content">
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Menu</h2>
                    <button className="sidebar-toggle" onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                </div>
                <ul>
                    <li>
                        <div
                            className={`menu-item ${activeMenu === 'learn' ? 'active' : ''}`}
                            onClick={() => handleToggle('learn')}
                        >
                            <span><i className="fas fa-circle menu-icon"></i>Learn</span>
                            {activeMenu === 'learn' ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        <ul className={`submenu ${activeMenu === 'learn' ? 'open' : ''}`}>
                            <li><Link to="/courses/learn">Submenu 1</Link></li>
                            <li><Link to="/courses/learn">Submenu 2</Link></li>
                        </ul>
                    </li>
                    <li>
                        <div
                            className={`menu-item ${activeMenu === 'syllabus' ? 'active' : ''}`}
                            onClick={() => handleToggle('syllabus')}
                        >
                            <span><i className="fas fa-circle menu-icon"></i>Syllabus</span>
                            {activeMenu === 'syllabus' ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        <ul className={`submenu ${activeMenu === 'syllabus' ? 'open' : ''}`}>
                            <li><Link to="/courses/syllabus">Submenu 1</Link></li>
                            <li><Link to="/courses/syllabus">Submenu 2</Link></li>
                        </ul>
                    </li>
                    <li>
                        <div
                            className={`menu-item ${activeMenu === 'coursescontent' ? 'active' : ''}`}
                            onClick={() => handleToggle('coursescontent')}
                        >
                            <span><i className="fas fa-circle menu-icon"></i>Courses Content</span>
                            {activeMenu === 'coursescontent' ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        <ul className={`submenu ${activeMenu === 'coursescontent' ? 'open' : ''}`}>
                            <li><Link to="/courses/coursescontent">Submenu 1</Link></li>
                            <li><Link to="/courses/coursescontent">Submenu 2</Link></li>
                        </ul>
                    </li>
                    <li>
                        <div
                            className={`menu-item ${activeMenu === 'vocabulary' ? 'active' : ''}`}
                            onClick={() => handleToggle('vocabulary')}
                        >
                            <span><i className="fas fa-circle menu-icon"></i>Vocabulary</span>
                            {activeMenu === 'vocabulary' ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        <ul className={`submenu ${activeMenu === 'vocabulary' ? 'open' : ''}`}>
                            <li><Link to="/courses/vocabulary">Submenu 1</Link></li>
                            <li><Link to="/courses/vocabulary">Submenu 2</Link></li>
                        </ul>
                    </li>
                    <li>
                        <div
                            className={`menu-item ${activeMenu === 'kanji' ? 'active' : ''}`}
                            onClick={() => handleToggle('kanji')}
                        >
                            <span><i className="fas fa-circle menu-icon"></i>Kanji</span>
                            {activeMenu === 'kanji' ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        <ul className={`submenu ${activeMenu === 'kanji' ? 'open' : ''}`}>
                            <li><Link to="/courses/kanji">Submenu 1</Link></li>
                            <li><Link to="/courses/kanji">Submenu 2</Link></li>
                        </ul>
                    </li>
                    <li>
                        <div
                            className={`menu-item ${activeMenu === 'grammar' ? 'active' : ''}`}
                            onClick={() => handleToggle('grammar')}
                        >
                            <span><i className="fas fa-circle menu-icon"></i>Grammar</span>
                            {activeMenu === 'grammar' ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        <ul className={`submenu ${activeMenu === 'grammar' ? 'open' : ''}`}>
                            <li><Link to="/courses/grammar">Submenu 1</Link></li>
                            <li><Link to="/courses/grammar">Submenu 2</Link></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div className="main-content">
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    <FaBars />
                </button>
                <h1>Nội dung học</h1>
                {/* Nội dung trang học */}
            </div>
        </div>
    );
}

export default CoursesContent;
