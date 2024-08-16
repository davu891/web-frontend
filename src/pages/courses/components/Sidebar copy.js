import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaBars, FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from '../../../axiosConfig'; // Sử dụng axios instance đã cấu hình

const Sidebar = ({ title, sidebarOpen, toggleSidebar, soBuoi }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const [activeMenu, setActiveMenu] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [unlockedLessons, setUnlockedLessons] = useState(0); // Mặc định khóa tất cả các bài học
    const [hasCourse, setHasCourse] = useState(false);

    const getActiveMenu = () => {
        const match = currentPath.match(/\/courses\/(vocabulary|grammar|kanji|test)\/[^\/]+\/(\d+)/);
        if (match) {
            return `learn${match[2]}`;
        } else if (currentPath.includes('/courses/learn/')) {
            return 'intro';
        }
        return null;
    };

    useEffect(() => {
        const initialMenu = getActiveMenu();
        setActiveMenu(initialMenu);
    }, [currentPath]);

    useEffect(() => {
        const loggedInStatus = localStorage.getItem('token');
        setIsLoggedIn(!!loggedInStatus);

        if (loggedInStatus) {
            const fetchUserCourses = async () => {
                try {
                    const token = loggedInStatus;
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const userId = payload.userId;

                    const response = await axios.get(`/auth/courses/${userId}`); // Đảm bảo rằng endpoint là /api/auth/courses/:userId
                    const course = response.data.find(course => course.course_title === title);
                    if (course) {
                        setUnlockedLessons(course.unlocked_lessons);
                        setHasCourse(true);
                    } else {
                        setHasCourse(false);
                    }
                } catch (error) {
                    console.error('Error fetching user courses:', error);
                }
            };

            fetchUserCourses();
        } else {
            setUnlockedLessons(2); // Nếu chưa đăng nhập, chỉ mở khóa bài 1 và 2
        }
    }, [title]);

    const handleToggle = (menu) => {
        if (menu === 'intro') {
            navigate(`/courses/learn/${title}`);
        } else {
            setActiveMenu(activeMenu === menu ? null : menu);
        }
    };

    const handleLockClick = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Bạn cần mua khóa học',
            text: 'Vui lòng mua khóa học để truy cập nội dung này!',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.setItem('redirectAfterPurchase', currentPath);
                navigate('/purchases', { state: { title } });
            }
        });
    };

    return (
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h2>Khóa học {title}</h2>
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    <FaBars />
                </button>
            </div>
            <ul>
                <li>
                    <div className={`menu-item ${activeMenu === 'intro' ? 'active' : ''}`} onClick={() => handleToggle('intro')}>
                        <span><i className="fas fa-circle menu-icon"></i>Giới thiệu khóa học</span>
                    </div>
                </li>
                {Array.from({ length: soBuoi }, (_, index) => (
                    <li key={index}>
                        <div className={`menu-item ${activeMenu === `learn${index + 1}` ? 'active' : ''}`} onClick={() => handleToggle(`learn${index + 1}`)}>
                            <span><i className="fas fa-circle menu-icon"></i>Buổi học số {index + 1}</span>
                            {(isLoggedIn && index < unlockedLessons) || index <= 1 ? (
                                activeMenu === `learn${index + 1}` ? <FaChevronUp /> : <FaChevronDown />
                            ) : (
                                <FaLock style={{ marginLeft: 'auto' }} />
                            )}
                        </div>
                        <ul className={`submenu ${activeMenu === `learn${index + 1}` ? 'open' : ''}`}>
                            {(isLoggedIn && index < unlockedLessons) || index <= 1 ? (
                                <>
                                    <li>
                                        <Link to={`/courses/vocabulary/${title}/${index + 1}`} className={`menu-item ${currentPath === `/courses/vocabulary/${title}/${index + 1}` ? 'active' : ''}`}>
                                            <i className="fas fa-plus menu-icon"></i>
                                            Từ vựng
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={`/courses/grammar/${title}/${index + 1}`} className={`menu-item ${currentPath === `/courses/grammar/${title}/${index + 1}` ? 'active' : ''}`}>
                                            <i className="fas fa-plus menu-icon"></i>
                                            Ngữ pháp
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={`/courses/kanji/${title}/${index + 1}`} className={`menu-item ${currentPath === `/courses/kanji/${title}/${index + 1}` ? 'active' : ''}`}>
                                            <i className="fas fa-plus menu-icon"></i>
                                            Kanji
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={`/courses/test/${title}/${index + 1}`} className={`menu-item ${currentPath === `/courses/test/${title}/${index + 1}` ? 'active' : ''}`}>
                                            <i className="fas fa-plus menu-icon"></i>
                                            Kiểm tra
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link className="menu-item" onClick={handleLockClick}>
                                            <i className="fas fa-lock menu-icon"></i>
                                            Từ vựng
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="menu-item" onClick={handleLockClick}>
                                            <i className="fas fa-lock menu-icon"></i>
                                            Ngữ pháp
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="menu-item" onClick={handleLockClick}>
                                            <i className="fas fa-lock menu-icon"></i>
                                            Kanji
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="menu-item" onClick={handleLockClick}>
                                            <i className="fas fa-lock menu-icon"></i>
                                            Kiểm tra
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </li>
                ))}
                
            </ul>
        </div>
    );
}

export default Sidebar;
