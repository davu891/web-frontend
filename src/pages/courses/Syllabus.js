import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Syllabus.css'; // Tạo một file CSS để định dạng bảng

const Syllabus = () => {
    const { title } = useParams();
    const [syllabusData, setSyllabusData] = useState([]);

    useEffect(() => {
        const fetchSyllabus = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/syllabus/${title}`);
                setSyllabusData(response.data);
            } catch (error) {
                console.error('Error fetching syllabus:', error);
            }
        };

        fetchSyllabus();
    }, [title]);

    return (
        <div className="syllabus">
            <h1>Syllabus for {title}</h1>
            <div className="button-container">
                <button className="button-64" role="button"><span className="text">Học thử</span></button>
                <button className="button-64" role="button"><span className="text">Đăng ký</span></button>
            </div>            <table>
                <thead>
                    <tr>
                        <th>Tiêu đề</th>
                        <th>Mô tả</th>
                        {/* Thêm các cột khác từ bảng syllabus_{title} nếu có */}
                    </tr>
                </thead>
                <tbody>
                    {syllabusData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.komoku}</td>
                            <td>{item.naiyo}</td>
                            {/* Thêm các cột khác từ bảng syllabus_{title} */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Syllabus;
