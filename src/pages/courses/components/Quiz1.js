import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from "react-device-detect";
import "./Quiz_np.css";
import Button from 'react-bootstrap/Button';

const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const DraggableItem = ({ text, index, moveItem }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "item",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "item",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        padding: "12px",
        margin: "6px",
        backgroundColor: isDragging ? "lightgreen" : "lightgray",
        cursor: "move",
      }}
    >
      {text}
    </div>
  );
};

const Quiz1 = ({ onQuizComplete, updateScore, updateIncorrectAnswers, updateTotalQuestions, score }) => {
  const { title, unit, mau_cau } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [correctOrder, setCorrectOrder] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [showCheckButton, setShowCheckButton] = useState(true);
  const [showNextButton, setShowNextButton] = useState(false);

  useEffect(() => {
    const fetchQuiz1Questions = async () => {
      try {
        const response = await axios.get(`${apiBaseURL}/api/questions_np/${title}/${unit}/${mau_cau}`);
        const data = response.data;

        const initialQuestion = data[0];
        const correctComponents = Array.isArray(initialQuestion.components)
          ? initialQuestion.components
          : initialQuestion.components.split('・');

        setQuestions(data);
        setCorrectOrder(correctComponents);
        setItems(shuffleArray([...correctComponents]));
        updateTotalQuestions(data.length);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuiz1Questions();
  }, [title, unit, mau_cau]);

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setItems(updatedItems);
  };

  const checkAnswer = () => {
    const userOrder = items.map(item => item.trim());

    if (JSON.stringify(userOrder) === JSON.stringify(correctOrder)) {
      setFeedbackMessage("Đúng!");
      setFeedbackType("success");
      updateScore(1);
    } else {
      setFeedbackMessage("Sai rồi, thử lại nhé!");
      setFeedbackType("error");
      updateIncorrectAnswers(questions[currentQuestionIndex].question, userOrder.join(' '), correctOrder.join(' '));
    }

    setShowCheckButton(false);
    setShowNextButton(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextQuestionIndex);

      const nextQuestion = questions[nextQuestionIndex];
      const nextCorrectOrder = Array.isArray(nextQuestion.components)
        ? nextQuestion.components
        : nextQuestion.components.split('・');

      setCorrectOrder(nextCorrectOrder);
      setItems(shuffleArray([...nextCorrectOrder]));

      setFeedbackMessage("");
      setShowCheckButton(true);
      setShowNextButton(false);
    } else {
      onQuizComplete();
    }
  };

  if (questions.length === 0) {
    return <p>Đang tải câu hỏi...</p>;
  }

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
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
          <span>Score: {score}</span> {/* Đảm bảo điểm số được hiển thị đúng */}
        </div>
        </div>
        <div className="question-section">
          {items.map((item, index) => (
            <DraggableItem key={index} index={index} text={item} moveItem={moveItem} canDrag={showCheckButton} />
          ))}
        </div>
        <div className="quiz-buttons">
          {showCheckButton && (
            <Button onClick={checkAnswer} className="button">Xác nhận</Button>
          )}

          {showNextButton && (
            <Button onClick={nextQuestion} className="button">Next Question</Button>
          )}
        </div>
      </div>

      {feedbackMessage && (
        <p className={`quiz-feedback ${feedbackType === "success" ? 'success' : 'error'}`}>
          {feedbackMessage}
        </p>
      )}
    </DndProvider>
  );
};

export default Quiz1;

