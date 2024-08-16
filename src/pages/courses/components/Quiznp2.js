import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Quiz_np.css";

const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

const Quiznp2 = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState(""); // success or error

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${apiBaseURL}/api/questions_np2`);
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const checkAnswer = () => {
    const correctAnswerIndex = questions[currentQuestionIndex].correct_answer_index;
    if (selectedAnswerIndex === correctAnswerIndex) {
      setFeedbackMessage("Đúng!");
      setFeedbackType("success");
    } else {
      setFeedbackMessage("Sai rồi, thử lại nhé!");
      setFeedbackType("error");
    }
  };

  if (questions.length === 0) {
    return <p>Đang tải câu hỏi...</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h2>{currentQuestion.question}</h2>
      <div className="options-container">
        {currentQuestion.options.map((option, index) => (
          <div key={index} className="option">
            <label>
              <input
                type="radio"
                name="answer"
                value={index + 1} // Index starts from 1
                onChange={() => setSelectedAnswerIndex(index + 1)}
              />
              {option}
            </label>
          </div>
        ))}
      </div>
      <button onClick={checkAnswer} style={{ marginTop: "20px" }}>Xác nhận</button>
      
      {/* Hiển thị thông báo kết quả */}
      {feedbackMessage && (
        <p style={{ color: feedbackType === "success" ? "green" : "red", marginTop: "20px" }}>
          {feedbackMessage}
        </p>
      )}
    </div>
  );
};

export default Quiznp2;
