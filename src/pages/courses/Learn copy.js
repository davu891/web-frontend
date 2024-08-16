import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CoursesContent.css';
import Sidebar from './components/Sidebar';

const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

const Learn = () => {
    const [activeMenu, setActiveMenu] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [syllabusData, setSyllabusData] = useState([]);
    const [soBuoi, setSoBuoi] = useState(0);
    const { title } = useParams();
    const navigate = useNavigate();

    const handleToggle = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchSyllabus = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/api/learn/${title}`);
                setSyllabusData(response.data.syllabus || []);
            } catch (error) {
                console.error('Error fetching syllabus:', error);
            }
        };

        const fetchCourseInfo = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/api/courses/${title}`);
                if (response.data && response.data.so_buoi) {
                    setSoBuoi(response.data.so_buoi);
                }
            } catch (error) {
                console.error('Error fetching course info:', error);
            }
        };

        if (title) {
            fetchSyllabus();
            fetchCourseInfo();
        }
    }, [title]);

    return (
        <div className="courses-content">
            <Sidebar
                title={title}
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                activeMenu={activeMenu}
                handleToggle={handleToggle}
                soBuoi={soBuoi}
            />
   
        </div>
    );
}

export default Learn;
