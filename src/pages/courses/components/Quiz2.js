import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import './Quiz2.css'; // Custom CSS for styling

const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

const Quiz2 = ({ onQuizComplete, updateScore, updateIncorrectAnswers, updateTotalQuestions, score }) => {
  const { title, unit, mau_cau } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState(""); 
  const [showCheckButton, setShowCheckButton] = useState(true);
  const [showNextButton, setShowNextButton] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const fetchQuiz2Questions = async () => {
      try {
        const response = await axios.get(`${apiBaseURL}/api/questions_np2/${title}/${unit}/${mau_cau}`);
        const data = response.data;
        setQuestions(data);
        updateTotalQuestions(data.length);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuiz2Questions();
  }, [title, unit, mau_cau]);

  const checkAnswer = () => {
    const correctAnswerIndex = questions[currentQuestionIndex].correct_answer_index;
    setIsAnswered(true);

    if (selectedAnswerIndex === correctAnswerIndex) {
      setFeedbackMessage("Correct!");
      setFeedbackType("success");
      updateScore(1);
    } else {
      setFeedbackMessage("Wrong! Try again.");
      setFeedbackType("error");
      updateIncorrectAnswers(
        questions[currentQuestionIndex].question,
        questions[currentQuestionIndex].options[selectedAnswerIndex - 1],
        questions[currentQuestionIndex].options[correctAnswerIndex - 1]
      );
    }
    setShowCheckButton(false);
    setShowNextButton(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswerIndex(null);
      setFeedbackMessage(""); 
      setIsAnswered(false);
    } else {
      onQuizComplete(); 
    }
    setShowCheckButton(true);
    setShowNextButton(false);
  };

  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container2">

                 <div className="section-title">
                  <span className="star-icon">★</span>
                  <span className="title-text">Bài tập {questions[currentQuestionIndex].type_name}</span>
                  </div>     
    

      <div className="quiz-header2">
        <div className="progress-bar2">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <div className="question-info2">
          <span>Question: {currentQuestionIndex + 1}/{questions.length}</span>
          <span>Score: {score}</span> {/* Hiển thị điểm số */}

        </div>
      </div>

      <div className="question-section2">
        <h2>{currentQuestion.question}</h2>
      </div>

      <div className="options-container2">
        {currentQuestion.options.map((option, index) => {
          const isCorrectAnswer = index + 1 === currentQuestion.correct_answer_index;
          const isSelected = selectedAnswerIndex === index + 1;

          let optionClass = "option2";
          if (isAnswered) {
            if (isCorrectAnswer) {
              optionClass += " correct";  // Highlight correct answer
            } else if (isSelected) {
              optionClass += " incorrect";  // Highlight incorrect answer if selected
            }
          } else if (isSelected) {
            optionClass += " selected";  // Highlight selected option
          }

          return (
            <div 
              key={index} 
              className={optionClass}
              onClick={() => !isAnswered && setSelectedAnswerIndex(index + 1)}
            >
              <span className="option-label2">{String.fromCharCode(65 + index)}</span>
              {option}
            </div>
          );
        })}
      </div>

      <div className="quiz-buttons2">
        {showCheckButton && (
          <Button 
            onClick={checkAnswer} 
            className="button2"
            disabled={selectedAnswerIndex === null}
          >
            Check Answer
          </Button>
        )}

        {showNextButton && (
          <Button onClick={nextQuestion} className="button2">Next Question</Button>
        )}
      </div>

      {feedbackMessage && (
        <p className={`quiz-feedback ${feedbackType === "success" ? 'success' : 'error'}`}>
          {feedbackMessage}
        </p>
      )}
    </div>
  );
};

export default Quiz2;
