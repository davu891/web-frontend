import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Furigana from './components/Furigana';
import './CoursesContent.css';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Quiznp1 from './components/Quiznp1';
import Button from 'react-bootstrap/Button';

const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

const Grammar = () => {
    const { title, unit, mau_cau } = useParams();
    const navigate = useNavigate();
    const [grammarData, setGrammarData] = useState([]);
    const [progressStep, setProgressStep] = useState(1);
    const [showFurigana, setShowFurigana] = useState(true); // State để quản lý Furigana

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [grammarResponse] = await Promise.all([
                    axios.get(`${apiBaseURL}/api/grammar/${title}/${unit}/${mau_cau}`)
                ]);
                setGrammarData(grammarResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [title, unit, mau_cau]);

    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleNextStep = () => setProgressStep(prevStep => prevStep + 1);
    const handlePreviousStep = () => setProgressStep(prevStep => prevStep - 1);

    // Hàm loại bỏ phần tử Furigana khi Furigana bị tắt
    const removeFurigana = (text) => {
        return text.replace(/【[^】]+】/g, '');
    };

    return (
        <>
<div className="breadcrumb-container">
    <div className="breadcrumb-content">
        <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }} onClick={() => handleNavigate("/")}>Home</Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/courses/learn/${title}` }} onClick={() => handleNavigate(`/courses/learn/${title}`)}>
                Khóa học {title}
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Ngữ pháp Buổi {unit}</Breadcrumb.Item>
        </Breadcrumb>
        <Button variant="info" className="toggle-furigana-button" onClick={() => setShowFurigana(!showFurigana)}>
            {showFurigana ? "Tắt Furigana" : "Bật Furigana"}
        </Button>
    </div>
</div>


            <div className="courses-content">
                <div className="main-content">
                    {progressStep === 1 && (
                        <>
                          
                            {grammarData.length > 0 ? (
                                grammarData.map((item, index) => (
                                    
                                    <div key={index} className="grammar-item">
                                        
                                        <h3>{showFurigana ? <Furigana text={`1. Cách sử dụng cấu trúc ${item.mau_cau}`} /> : `1. Cách sử dụng cấu trúc ${removeFurigana(item.mau_cau)}`}</h3>
                                        
                                        <div className="section-title">
                                            <span className="star-icon">★</span>
                                            <span className="title-text">Cấu trúc</span>
                                        </div>

                                        <div className='custom-box'>
                                            {showFurigana ? <Furigana text={item.cau_truc} /> : removeFurigana(item.cau_truc)}
                                        </div>

                                        <div className="section-title">
                                            <span className="star-icon">★</span>
                                            <span className="title-text">Ý nghĩa</span>
                                        </div>

                                        <div className='custom-box'>
                                            {showFurigana ? <Furigana text={item.cach_dung_tv} /> : removeFurigana(item.cach_dung_tv)}
                                        </div>
                                        
                                        <h3>2. Ví dụ</h3>

                                        {item.vidu01_jp && (
                                            <>
                                                <div>
                                                    {showFurigana ? <Furigana text={item.vidu01_jp} /> : removeFurigana(item.vidu01_jp)}
                                                    <p>→{item.vidu01_vn}</p>
                                                </div>
                                            </>
                                        )}
                                        
                                        {item.vidu02_jp && (
                                            <>
                                                <div>
                                                    {showFurigana ? <Furigana text={item.vidu02_jp} /> : removeFurigana(item.vidu02_jp)}
                                                    <p>→{item.vidu02_vn}</p>
                                                </div>
                                            </>
                                        )}
                                        {item.vidu03_jp && (
                                            <>
                                                <div>
                                                    {showFurigana ? <Furigana text={item.vidu03_jp} /> : removeFurigana(item.vidu03_jp)}
                                                    <p>→{item.vidu03_vn}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))
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
                            <div className="thirteen">
                              <h1>Luyện tập</h1>
                            </div>
                            <Quiznp1 />
                            <div className="floating-container">
                                <button onClick={handlePreviousStep}>Back</button>
                                <button onClick={() => alert('Kết thúc')}>Kết thúc</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Grammar;
