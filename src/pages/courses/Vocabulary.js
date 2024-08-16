import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import Flashcard from './components/Flashcard';
import Quiz_tv from './components/Quiz_tv';
import './CoursesContent.css';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Swal from 'sweetalert2';

const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

const Vocabulary = () => {
    const { title, unit } = useParams();
    const [vocabData, setVocabData] = useState([]);
    const [progressStep, setProgressStep] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVocab = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/api/vocabulary/${title}/${unit}`);
                setVocabData(response.data);
            } catch (error) {
                console.error('Error fetching vocabulary:', error);
            }
        };

        fetchVocab();
    }, [title, unit]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (progressStep === 3) {
                event.preventDefault();
                event.returnValue = ''; // This is required for the confirmation dialog to show
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [progressStep]);

    const confirmNavigation = (callback) => {
        Swal.fire({
            title: 'Bạn có chắc muốn dừng Quiz?',
            text: "Mọi tiến độ sẽ không được lưu!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không'
        }).then((result) => {
            if (result.isConfirmed) {
                callback();
            }
        });
    };

    const handleNavigate = (path) => {
        if (progressStep === 3) {
            confirmNavigation(() => navigate(path));
        } else {
            navigate(path);
        }
    };

    const handleNextStep = () => {
        setProgressStep(prevStep => prevStep + 1);
    };

    const handlePreviousStep = () => {
        if (progressStep === 3) {
            confirmNavigation(() => setProgressStep(prevStep => prevStep - 1));
        } else {
            setProgressStep(prevStep => prevStep - 1);
        }
    };

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        window.speechSynthesis.speak(utterance);
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
                <Breadcrumb.Item active>Từ vựng bài {unit}</Breadcrumb.Item>
            </Breadcrumb>
</div>
</div>
            <div className="courses-content">
                {progressStep === 1 && (
                    <>
                        <div className='table-container'>
                            <h2>Danh sách Từ vựng bài {unit}</h2>
                            {vocabData.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Thể loại</th>
                                            <th>Từ vựng</th>
                                            <th>Kanji</th>
                                            <th>Nghĩa</th>
                                            <th>Phát âm</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vocabData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.the_loai}</td>
                                                <td>{item.tu_vung}</td>
                                                <td>{item.kanji}</td>
                                                <td>{item.nghia}</td>
                                                <td>
                                                    <button onClick={() => speak(item.kanji || item.tu_vung)}>
                                                        <i className="fas fa-volume-up"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                
                            ) : (
                                <p>No vocabulary available</p>
                            )}
                        </div>
                        <div className="floating-container">
                            <button onClick={handleNextStep}>Hoàn thành</button>
                        </div>
                    </>
                )}
                {progressStep === 2 && (
                    <>
                        <h2>Flashcard <span>Từ vựng bài</span> {unit}</h2>
                        <Flashcard kanjiList={vocabData} />
                        <div className="floating-container">
                            <button onClick={handlePreviousStep}>Back</button>
                            <button onClick={handleNextStep}>Hoàn thành</button>
                        </div>
                    </>
                )}
                {progressStep === 3 && (
                    <>
                        <Quiz_tv title={title} unit={unit} />
                        <div className="floating-container">
                            <button onClick={handlePreviousStep}>Back</button>
                            <button onClick={() => handleNavigate(`/courses/learn/${title}`)}>Kết thúc</button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Vocabulary;
