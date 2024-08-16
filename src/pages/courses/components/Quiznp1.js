import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import Quiz1 from "./Quiz1";
import Quiz2 from "./Quiz2";
import QuizResult from "./Quiz12Result";

const Quiz = () => {
  const { title, unit, mau_cau } = useParams();
  const [currentQuiz, setCurrentQuiz] = useState("quiz2");
  const [totalScore, setTotalScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  const handleQuizComplete = () => {
    if (currentQuiz === "quiz2") {
      setCurrentQuiz("quiz1");
    } else {
      setCurrentQuiz("result");
    }
  };

  const updateScore = (points) => {
    setTotalScore(prevScore => prevScore + points);
  };

  const updateIncorrectAnswers = (question, userAnswer, correctAnswer) => {
    setIncorrectAnswers(prev => [
      ...prev,
      { question, userAnswer, correctAnswer },
    ]);
  };

  const updateTotalQuestions = (numQuestions) => {
    setTotalQuestions(prevTotal => prevTotal + numQuestions);
  };

  return (
    <div>
      {currentQuiz === "quiz2" && (
       <Quiz2
       onQuizComplete={handleQuizComplete}
       updateScore={updateScore}
       updateIncorrectAnswers={updateIncorrectAnswers}
       updateTotalQuestions={updateTotalQuestions}
       score={totalScore} // Truyền điểm số hiện tại
     />
     
      )}
      {currentQuiz === "quiz1" && (
       <Quiz1
       onQuizComplete={handleQuizComplete}
       updateScore={updateScore}
       updateIncorrectAnswers={updateIncorrectAnswers}
       updateTotalQuestions={updateTotalQuestions}
       score={totalScore} // Truyền điểm số hiện tại
     />
     
      )}
      {currentQuiz === "result" && (
        <QuizResult
          score={totalScore}
          totalQuestions={totalQuestions}
          incorrectAnswers={incorrectAnswers}
          title={title}
          unit={unit}
          mau_cau={mau_cau}
        />
      )}
    </div>
  );
};

export default Quiz;
