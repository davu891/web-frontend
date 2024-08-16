import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Flashcard from './components/Flashcard';
import './CoursesContent.css';

const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

const Test = () => {
    const { title, unit } = useParams();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [grammarData, setGrammarData] = useState([]);
    const [progressStep, setProgressStep] = useState(1);
    const [activeMenu, setActiveMenu] = useState(null);
    const [totalUnits, setTotalUnits] = useState(0);

    useEffect(() => {
        const fetchGrammar = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/api/test/${title}/${unit}`);
                setGrammarData(response.data);
            } catch (error) {
                console.error('Error fetching grammar:', error);
            }
        };

        const fetchCourseInfo = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/api/courses/${title}`);
                if (response.data && response.data.so_buoi) {
                    setTotalUnits(response.data.so_buoi);
                }
            } catch (error) {
                console.error('Error fetching course info:', error);
            }
        };

        fetchGrammar();
        fetchCourseInfo();
    }, [title, unit]);

    const handleNextStep = () => {
        setProgressStep(prevStep => prevStep + 1);
    };

    const handlePreviousStep = () => {
        setProgressStep(prevStep => prevStep - 1);
    };

    const handleToggle = (menu) => {
        if (menu === 'intro') {
            navigate(`/courses/learn/${title}`);
        } else {
            setActiveMenu(activeMenu === menu ? null : menu);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="courses-content">
            <Sidebar
                title={title}
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                activeMenu={activeMenu}
                handleToggle={handleToggle}
                soBuoi={totalUnits}
            />
            <div className="main-content">
                {progressStep === 1 && (
                    <>
                        <h2>Kiểm tra Buổi {unit}</h2>
                        {grammarData.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Mẫu câu</th>
                                        <th>Cấu trúc</th>
                                        <th>Cách dùng JP</th>
                                        <th>Cách dùng TV</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grammarData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.stt}</td>
                                            <td>{item.mau_cau}</td>
                                            <td>{item.cau_truc}</td>
                                            <td>{item.cach_dung_jp}</td>
                                            <td>{item.cach_dung_tv}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No grammar available</p>
                        )}
                        <div className="floating-container">
                            <button onClick={handleNextStep}>Hoàn thành</button>
                        </div>
                    </>
                )}
                {progressStep === 2 && (
                    <>
                        <h2>Flashcard Ngữ pháp Buổi {unit}</h2>
                        <Flashcard />
                        <div className="floating-container">
                            <button onClick={handlePreviousStep}>Back</button>
                            <button onClick={handleNextStep}>Hoàn thành</button>
                        </div>
                    </>
                )}
                {progressStep === 3 && (
                    <>
                       
                        <div className="floating-container">
                            <button onClick={handlePreviousStep}>Back</button>
                            <button onClick={() => alert('Kết thúc')}>Kết thúc</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Test;
