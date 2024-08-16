import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import Flashcard from './components/Flashcard';
import Quiz from './components/Quiz';
import './CoursesContent.css';

const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

const Vocabulary = () => {
    const { title, unit } = useParams();
    const [vocabData, setVocabData] = useState([]);
    const [progressStep, setProgressStep] = useState(1);

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

    const handleNextStep = () => {
        setProgressStep(prevStep => prevStep + 1);
    };

    const handlePreviousStep = () => {
        setProgressStep(prevStep => prevStep - 1);
    };

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="courses-content">
            {progressStep === 1 && (
                <>
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
                    <div className="floating-container">
                        <button onClick={handleNextStep}>Hoàn thành</button>
                    </div>
                </>
            )}
            {progressStep === 2 && (
                <>
                    <h2>Flashcard <span>Từ vựng bài</span> {unit}</h2>
                    <Flashcard vocabData={vocabData} />
                    <div className="floating-container">
                        <button onClick={handlePreviousStep}>Back</button>
                        <button onClick={handleNextStep}>Hoàn thành</button>
                    </div>
                </>
            )}
            {progressStep === 3 && (
                <>
                    <Quiz title={title} unit={unit} />
                    <div className="floating-container">
                        <button onClick={handlePreviousStep}>Back</button>
                        <button onClick={() => alert('Kết thúc')}>Kết thúc</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Vocabulary;
