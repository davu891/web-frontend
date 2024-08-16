import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaBars, FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from '../../../utils/axiosConfig';
import ProgressBar from './ProgressBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import CourseContent from '../CoursesContent'; // Adjust the import path as necessary

const Sidebar = ({ title, soBuoi }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [activeMenu, setActiveMenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unlockedLessons, setUnlockedLessons] = useState(0);
  const [hasCourse, setHasCourse] = useState(false);
  const [quizProgress, setQuizProgress] = useState({});
  const [grammarSentences, setGrammarSentences] = useState({});
  const [grammarQuizProgress, setGrammarQuizProgress] = useState({});
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const getActiveMenu = () => {
    const match = currentPath.match(/\/courses\/(vocabulary|grammar|kanji|test)\/[^\/]+\/(\d+)/);
    if (match) {
      return `learn${match[2]}`;
    } else if (currentPath.includes('/courses/learn/')) {
      return 'intro';
    }
    return null;
  };

  useEffect(() => {
    const initialMenu = getActiveMenu();
    setActiveMenu(initialMenu);
  }, [currentPath]);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('token');
    setIsLoggedIn(!!loggedInStatus);

    if (loggedInStatus) {
      const fetchUserCourses = async () => {
        try {
          const token = loggedInStatus;
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.userId;

          const [coursesResponse, progressResponse, grammarResponses, grammarQuizResponse] = await Promise.all([
            axios.get(`/auth/courses/${userId}`),
            axios.get(`/quiz-progress/${userId}/${title}`),
            Promise.all(
              Array.from({ length: soBuoi }, (_, index) =>
                axios.get(`/grammar-sentences/${title}/${index + 1}`)
              )
            ),
            axios.get(`/grammar-quiz-progress/${userId}/${title}`)
          ]);

          const course = coursesResponse.data.find(course => course.course_title === title);
          if (course) {
            setUnlockedLessons(course.unlocked_lessons);
            setHasCourse(true);
          } else {
            setHasCourse(false);
          }

          const progress = progressResponse.data.reduce((acc, curr) => {
            acc[curr.unit] = curr.percentage;
            return acc;
          }, {});

          const grammarData = grammarResponses.reduce((acc, res, index) => {
            acc[index + 1] = res.data;
            return acc;
          }, {});

          const grammarQuizData = grammarQuizResponse.data.reduce((acc, curr) => {
            if (!acc[curr.unit]) {
              acc[curr.unit] = {};
            }
            acc[curr.unit][curr.mau_cau] = curr.percentage;
            return acc;
          }, {});

          console.log('Quiz progress:', progress);
          console.log('Grammar sentences:', grammarData);
          console.log('Grammar quiz progress:', grammarQuizData);

          setQuizProgress(progress);
          setGrammarSentences(grammarData);
          setGrammarQuizProgress(grammarQuizData);
        } catch (error) {
          console.error('Error fetching user courses or quiz progress:', error);
        }
      };

      fetchUserCourses();
    } else {
      setUnlockedLessons(2);
    }
  }, [title, soBuoi]);

  const handleToggle = (menu) => {
    if (menu === 'intro') {
      navigate(`/courses/learn/${title}`);
    } else {
      setActiveMenu(activeMenu === menu ? null : menu);
    }
  };

  const handleLockClick = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Bạn cần mua khóa học',
      text: 'Vui lòng mua khóa học để truy cập nội dung này!',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.setItem('redirectAfterPurchase', currentPath);
        navigate('/purchases', { state: { title } });
      }
    });
  };

  return (
    <Container fluid>
      <Row>
        {/* Offcanvas for small screens */}
        <Col xs={12} className="d-block d-lg-none">
          <button className="rounded-button color-white" variant="primary" onClick={() => setShowOffcanvas(true)}>Học thử ngay...</button>
          <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="start">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>List bài học {title}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <ul>
                <li>
                  <div
                    className={`menu-item ${activeMenu === 'intro' ? 'active' : ''}`}
                    onClick={() => handleToggle('intro')}
                  >
                    <span><i className="fas fa-circle menu-icon"></i>Giới thiệu khóa học</span>
                  </div>
                </li>
                {Array.from({ length: soBuoi }, (_, index) => (
                  <li key={index}>
                    <div
                      className={`menu-item ${activeMenu === `learn${index + 1}` ? 'active' : ''}`}
                      onClick={() => handleToggle(`learn${index + 1}`)}
                    >
                      <span><i className="fas fa-circle menu-icon"></i>Buổi số {index + 1}</span>
                      {(isLoggedIn && index < unlockedLessons) || index <= 1 ? (
                        <>
                          <ProgressBar progress={quizProgress[index + 1] || 0} />
                          {activeMenu === `learn${index + 1}` ? <FaChevronUp /> : <FaChevronDown />}
                        </>
                      ) : (
                        <FaLock style={{ marginLeft: 'auto' }} />
                      )}
                    </div>
                    <ul className={`submenu ${activeMenu === `learn${index + 1}` ? 'open' : ''}`}>
                      {(isLoggedIn && index < unlockedLessons) || index <= 1 ? (
                        <>
                          <li className="vocabulary-item">
                            <Link
                              to={`/courses/vocabulary/${title}/${index + 1}`}
                              className={`menu-item ${currentPath === `/courses/vocabulary/${title}/${index + 1}` ? 'active' : ''}`}
                            >
                              <i className="fas fa-plus menu-icon"></i>
                              <span className="item-text">1. Từ vựng</span>
                              <span className="item-percentage">{quizProgress[index + 1] || 0}%</span>
                            </Link>
                          </li>
                          <li className="grammar-item">
                            <Link
                              to={`/courses/grammar/${title}/${index + 1}`}
                              className={`menu-item ${currentPath === `/courses/grammar/${title}/${index + 1}` ? 'active' : ''}`}
                            >
                              <i className="fas fa-plus menu-icon"></i>
                              <span className="item-text">2. Ngữ pháp</span>
                            </Link>
                            {/* Hiển thị tỷ lệ phần trăm cho mỗi câu trong ngữ pháp */}
                            <ul className='submenu-2'>
                              {grammarSentences[index + 1] && grammarSentences[index + 1].map((sentence, i) => (
                                <li key={i}>
                                  <Link
                                    to={`/courses/grammar/${title}/${index + 1}/${i + 1}`}
                                    className='menu-item'
                                  >
                                    <span className="item-text">Câu {i + 1}</span>
                                    <span className="item-percentage">{grammarQuizProgress[index + 1]?.[i + 1] || 0}%</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                          <li>
                            <Link
                              to={`/courses/coursescontent/${title}/${index + 1}`}
                              className={`menu-item ${currentPath === `/courses/coursescontent/${title}/${index + 1}` ? 'active' : ''}`}
                            >
                              <i className="fas fa-plus menu-icon"></i>
                              <span className="item-text">3. Nội dung bài học</span>
                            </Link>
                          </li>
                        </>
                      ) : (
                        <li>
                          <div className="menu-item locked">
                            <span><FaLock /> Khóa học chưa mở</span>
                          </div>
                        </li>
                      )}
                    </ul>
                  </li>
                ))}
              </ul>
            </Offcanvas.Body>
          </Offcanvas>
        </Col>

        {/* Sidebar for larger screens */}
        <Col lg={4} className="d-none d-lg-block">
          <div className="sidebar">
            <h2>{title}</h2>
            <ul>
              <li>
                <div
                  className={`menu-item ${activeMenu === 'intro' ? 'active' : ''}`}
                  onClick={() => handleToggle('intro')}
                >
                  <span><i className="fas fa-circle menu-icon"></i>Giới thiệu khóa học</span>
                </div>
              </li>
              {Array.from({ length: soBuoi }, (_, index) => (
  <li key={index}>
    <div
      className={`menu-item ${activeMenu === `learn${index + 1}` ? 'active' : ''}`}
      onClick={() => handleToggle(`learn${index + 1}`)}
    >
      <span><i className="fas fa-circle menu-icon"></i>Buổi số {index + 1}</span>
      {(isLoggedIn && index < unlockedLessons) || index <= 1 ? (
        <>
          <ProgressBar progress={quizProgress[index + 1] || 0} />
          {activeMenu === `learn${index + 1}` ? <FaChevronUp /> : <FaChevronDown />}
        </>
      ) : (
        <FaLock style={{ marginLeft: 'auto' }} />
      )}
    </div>
    <ul className={`submenu ${activeMenu === `learn${index + 1}` ? 'open' : ''}`}>
      {(isLoggedIn && index < unlockedLessons) || index <= 1 ? (
        <>
          <li className="vocabulary-item">
            <Link
              to={`/courses/vocabulary/${title}/${index + 1}`}
              className={`menu-item ${currentPath === `/courses/vocabulary/${title}/${index + 1}` ? 'active' : ''}`}
            >
              <i className="fas fa-plus menu-icon"></i>
              <span className="item-text">1. Từ vựng</span>
              <span className="item-percentage">{quizProgress[index + 1] || 0}%</span>
            </Link>
          </li>
          <li className="grammar-item">
            <Link
              to={`#`}
              className={`menu-item ${currentPath === `/courses/grammar/${title}/${index + 1}` ? 'active' : ''}`}
            >
              <i className="fas fa-plus menu-icon"></i>
              <span className="item-text">2. Ngữ pháp</span>
            </Link>
            {/* Hiển thị tỷ lệ phần trăm cho mỗi câu trong ngữ pháp */}
            <ul className='submenu-2'>
              {grammarSentences[index + 1] && grammarSentences[index + 1].map((sentence, i) => (
                <li key={i}>
                  <Link
                    to={`/courses/grammar/${title}/${index + 1}/${i + 1}`}
                    className='menu-item'
                  >
                    <span className="item-text">Mẫu {i + 1}: {sentence.mau_cau}</span>
                    <span className="item-percentage">{grammarQuizProgress[index + 1]?.[i + 1] || 0}%</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <Link
              to={`/courses/kanji/${title}/${index + 1}`}
              className={`menu-item ${currentPath === `/courses/kanji/${title}/${index + 1}` ? 'active' : ''}`}
            >
              <i className="fas fa-plus menu-icon"></i>
              <span className="item-text">3. Kanji</span>
            </Link>
          </li>
          <li>
            <Link
              to={`/courses/test/${title}/${index + 1}`}
              className={`menu-item ${currentPath === `/courses/test/${title}/${index + 1}` ? 'active' : ''}`}
            >
              <i className="fas fa-plus menu-icon"></i>
              <span className="item-text">4. Kiểm tra</span>
            </Link>
          </li>
        </>
      ) : (
        <li>
          <div className="menu-item locked">
            <span><FaLock /> Khóa học chưa mở</span>
          </div>
        </li>
      )}
    </ul>
  </li>
))}

            </ul>
          </div>
        </Col>
        <Col lg={8}>
          <CourseContent title={title} />
        </Col>
      </Row>
    </Container>
  );
};

export default Sidebar;
