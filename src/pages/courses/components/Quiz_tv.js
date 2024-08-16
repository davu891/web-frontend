import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../../utils/axiosConfig';
import './Quiz_tv.css';
import correctSound from '../../../assets/sound/right.mp3';
import wrongSound from '../../../assets/sound/wrong.mp3';

const Quiz = ({ title, unit }) => {
    const [currentStep, setCurrentStep] = useState('start');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState([]);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [retryCount, setRetryCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10); // Initialize the timer with 10 seconds

    const navigate = useNavigate();

    const correctAudio = new Audio(correctSound);
    const wrongAudio = new Audio(wrongSound);

    useEffect(() => {
        const fetchQuizQuestions = async () => {
            try {
                const response = await axios.get(`/quiz/${title}/${unit}`);
                setQuizQuestions(response.data);
            } catch (error) {
                console.error('Error fetching quiz questions:', error);
            }
        };

        fetchQuizQuestions();
    }, [title, unit]);

    useEffect(() => {
        if (currentStep === 'question' && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            handleTimeout();
        }
    }, [timeLeft, currentStep]);

    const startQuiz = () => {
        setCurrentStep('question');
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setCorrectAnswers(0);
        setIncorrectAnswers([]);
        setTimeLeft(10); // Reset the timer
    };

    const handleTimeout = () => {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        setIncorrectAnswers([...incorrectAnswers, { ...currentQuestion, selectedOption: null }]);
        wrongAudio.play();
        setIsAnswered(true);

        setTimeout(() => {
            nextQuestion();
        }, 2000);
    };

    const checkAnswer = () => {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        if (selectedOption === currentQuestion.answer) {
            setCorrectAnswers(correctAnswers + 1);
            correctAudio.play();
        } else {
            setIncorrectAnswers([...incorrectAnswers, { ...currentQuestion, selectedOption }]);
            wrongAudio.play();
        }
        setIsAnswered(true);

        setTimeout(() => {
            nextQuestion();
        }, 2000);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setTimeLeft(10); // Reset the timer for the next question
        } else {
            saveQuizResults();
            setCurrentStep('end');
        }
    };

    const saveQuizResults = async () => {
        const userId = localStorage.getItem('userId');
        try {
            await axios.post('/quiz/save', {
                userId,
                title,
                unit,
                correctAnswers,
                incorrectAnswers,
                totalQuestions: quizQuestions.length
            });
        } catch (error) {
            console.error('Error saving quiz results:', error);
        }
    };

    const handleOptionClick = (option) => {
        if (!isAnswered) {
            setSelectedOption(option);
        }
    };

    const handleRetry = () => {
        if (retryCount < 1) {
            Swal.fire({
                title: 'Bạn còn 1 lần làm lại Quiz. Bạn có muốn làm ngay bây giờ?',
                showCancelButton: true,
                confirmButtonText: 'Có',
                cancelButtonText: 'Không'
            }).then((result) => {
                if (result.isConfirmed) {
                    setRetryCount(retryCount + 1);
                    startQuiz();
                }
            });
        } else {
            Swal.fire({
                title: 'Bạn đã hết lượt làm lại',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
    };

    const getPerformanceMessage = (percentage) => {
        if (percentage < 40) {
            return "Kết quả chưa tốt! Bạn cần ôn tập lại bằng Flashcard";
        } else if (percentage < 60) {
            return "Chưa đạt! Bạn cần học thuộc kĩ hơn bằng Flashcard";
        } else if (percentage < 75) {
            return "Mức trung bình. Bạn cần học thuộc thêm nữa";
        } else if (percentage < 90) {
            return "Bạn làm khá tốt";
        } else {
            return "Xuất sắc!";
        }
    };

    if (quizQuestions.length === 0) {
        return <p>Loading questions...</p>;
    }

    return (
        <div className="quiz-wrapper">
            {currentStep === 'start' && (
                <div className="start-screen">
                    <h2>Hướng dẫn làm Quiz</h2>
                    <p>Bạn đã sẵn sàng? Bấm Start để bắt đầu</p>
                    <button className="start-button" onClick={startQuiz}>Start</button>
                </div>
            )}
            {currentStep === 'question' && (
                <div className="question-screen">
                    <h2>Câu hỏi số {currentQuestionIndex + 1}</h2>
                    <p>{quizQuestions[currentQuestionIndex].question}</p>
                    <div className="timer">Thời gian còn lại: {timeLeft}s</div> {/* Display the timer */}
                    <div className="options">
                        {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                            <div
                                key={index}
                                className={`option ${selectedOption === option ? 'selected' : ''} ${isAnswered && option === quizQuestions[currentQuestionIndex].answer ? 'correct' : ''} ${isAnswered && selectedOption === option && option !== quizQuestions[currentQuestionIndex].answer ? 'incorrect' : ''}`}
                                onClick={() => handleOptionClick(option)}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                    {!isAnswered && (
                        <button className="check-button" onClick={checkAnswer} disabled={selectedOption === null}>Check đáp án</button>
                    )}
                </div>
            )}
            {currentStep === 'end' && (
                <div className="end-screen">
                    <h2>Kết quả</h2>
                    <p>Bạn đã trả lời đúng {correctAnswers} / {quizQuestions.length} ({((correctAnswers / quizQuestions.length) * 100).toFixed(2)}%)</p>
                    <p>{getPerformanceMessage((correctAnswers / quizQuestions.length) * 100)}</p>
                    <button className="start-button" onClick={handleRetry}>Làm lại Quiz</button>
                    <p>Lượt làm lại: {1 - retryCount}</p>
                    {incorrectAnswers.length > 0 && (
                        
                        <div className="incorrect-answers">
                            <h3>({incorrectAnswers.length}) Câu trả lời sai:</h3>
                            <ul>
                                {incorrectAnswers.map((question, index) => (
                                    <li key={index}>
                                        {question.question}<br />
                                        Đáp án đúng: {question.answer}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                   
                </div>
            )}
        </div>
    );
};

export default Quiz;
