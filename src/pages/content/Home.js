import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './Home.css';

const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/api/courses`);
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/api/posts`);
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchCourses();
        fetchPosts();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true
    };

    return (
        <div className="home">
            <Slider {...settings}>
                <div className="slide">
                    <img src="/img/japan01.jpg" alt="Slide 1" className="slider-image" />
                    <div className="slide-text">
                        <h2>Slide 1 Title</h2>
                        <p>Slide 1 description goes here.</p>
                    </div>
                </div>
                <div className="slide">
                    <img src="/img/japan02.jpg" alt="Slide 2" className="slider-image" />
                    <div className="slide-text">
                        <h2>Slide 2 Title</h2>
                        <p>Slide 2 description goes here.</p>
                    </div>
                </div>
                <div className="slide">
                    <img src="/img/japan03.jpg" alt="Slide 3" className="slider-image" />
                    <div className="slide-text">
                        <h2>Slide 3 Title</h2>
                        <p>Slide 3 description goes here.</p>
                    </div>
                </div>
            </Slider>
            <div className="price">
            <div className="price-area">
                <div className="section-header">
                    <h2>Khóa học <span>ONLINE</span></h2> 
                    <p>Dành cho người tự học, người đi làm, người chinh phục JLPT</p>
                </div>
                <div className="container">
                    {courses.map((course, index) => (
                        <div className="box" key={index}>
                            <ul className="deals">
                                <li className="plans">{course.title}</li>
                                <li>Số buổi: <span>{course.so_buoi}</span></li>
                                <li>Thời gian: <span>{course.time}</span></li>
                                <li>Giá:  <span>{course.cost} vnd</span></li>
                                <li>Đối tượng: <span>{course.doi_tuong}</span></li>
                                <li>
                                    <Link to={`/courses/learn/${course.title}`}>
                                        <button className="rounded-button">Xem ngay...</button>
                                    </Link>
                                </li>
                                <li>
                                    <Link to={`/courses/learn/${course.title}`} className="details-link">
                                        Xem chi tiết...
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            </div>
            {/* New Section: Display Posts */}
            <div className="posts-area">
                <div className="section-header">
                    <h2>Bài đăng mới nhất</h2>
                    <p>Đọc các bài viết mới nhất từ blog của chúng tôi</p>
                </div>
                <Row xs={1} md={3} className="g-4">
      {Array.from({ length: 6}).map((_, idx) => (
        <Col key={idx}>
          <Card>
          <Card.Img variant="top" src="https://via.placeholder.com/150" />
            <Card.Body>
              <Card.Title>Card title</Card.Title>
              <Card.Text>
                This is a longer card with supporting text below as a natural
                lead-in to additional content. This content is a little bit
                longer.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
            </div>
        </div>
    );
};

export default Home;
