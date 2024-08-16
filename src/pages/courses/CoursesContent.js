import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CoursesContent.css';
import KhoaN5 from '../../components/khoaN5';

const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

const CourseContent = () => {
    const [activeMenu, setActiveMenu] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [syllabusData, setSyllabusData] = useState([]);
    const [soBuoi, setSoBuoi] = useState(0);
    const { title } = useParams();
    const [cost, setCost] = useState(0);
    const [time, setTime] = useState(0);



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
                    setCost(response.data.cost);
                    setTime(response.data.time);

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
        <div className="course-content">

    
                {/* Thêm thành phần KhoaN5 */}
              {/* Thêm thành phần KhoaN5 và truyền các biến */}
              <KhoaN5 title={title} soBuoi={soBuoi} cost={cost} time={time} />
                <div className='table-content'>
                <h1>Nội dung học tập</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Tiêu đề</th>
                            <th>Mô tả</th>
                        </tr>
                    </thead>
                    <tbody>
                        {syllabusData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.komoku}</td>
                                <td>{item.naiyo.split('\r\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
        </div>
    );
}

export default CourseContent;
