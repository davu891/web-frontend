import React, { useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from '../../../utils/axiosConfig';

const QuizResult = ({ score, totalQuestions, incorrectAnswers, title, unit, mau_cau }) => {
  const percentageCorrect = parseFloat(((score / totalQuestions) * 100).toFixed(2));
  const userId = localStorage.getItem('userId');

  useEffect(() => {
// QuizResult.js
const saveQuiznpResults = async () => {
  if (!userId) {
    console.error("User ID not found in localStorage.");
    return;
  }

  try {
    console.log({
      userId,
      title,
      unit,
      mau_cau,
      percentageCorrect
    }); // Log data to check
    
    await axios.post('/save-quiz-result', {
      userId,
      title,
      unit,
      mau_cau,
      percentageCorrect
    });
    console.log('Kết quả lưu thành công.');
  } catch (error) {
    console.error('Error saving quiz results:', error);
  }
};


    saveQuiznpResults();
  }, [userId, percentageCorrect, title, unit, mau_cau]);

  return (
    <div className="quiz-result">
      <h2>Kết quả Quiz</h2>

      <div style={{ width: 100, height: 100, margin: "20px auto" }}>
        <CircularProgressbar
          value={percentageCorrect}
          text={`${percentageCorrect}%`}
          styles={buildStyles({
            textSize: "16px",
            pathColor: `rgba(62, 152, 199, ${percentageCorrect / 100})`,
            textColor: "#3e98c7",
            trailColor: "#d6d6d6",
            backgroundColor: "#3e98c7",
          })}
        />
      </div>

      <p>Điểm của bạn: {score} trên {totalQuestions}</p>

      {incorrectAnswers.length > 0 ? (
        <div>
          <h3>Các câu trả lời sai:</h3>
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Câu hỏi</th>
                <th>Câu trả lời của bạn</th>
                <th>Đáp án đúng</th>
              </tr>
            </thead>
            <tbody>
              {incorrectAnswers.map((answer, index) => (
                <tr key={index}>
                  <td>{answer.question}</td>
                  <td style={{ color: "red" }}>{answer.userAnswer}</td>
                  <td style={{ color: "green" }}>{answer.correctAnswer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Tuyệt vời! Bạn đã trả lời đúng tất cả các câu hỏi!</p>
      )}

      <button onClick={() => window.location.reload()}>Làm lại Quiz</button>
    </div>
  );
};

export default QuizResult;
