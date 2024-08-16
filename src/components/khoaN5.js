import React from 'react';
import './khoaN5.css';

const KhoaN5 = ({ title, soBuoi,time, cost }) => {
    return (
        <>
 
            {/* Section 1: Course Card */}
            <section className="container position-relative">
             
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 text-center">

                        <div className="course-wrapper">
                            <div className="course-title">KHÓA HỌC JLPT</div>
                            <div className="course-card">
                                <div className="course-level">ONLINE {title}</div>
                                <div className="course-duration">Số buổi học {soBuoi}</div>
                                <div className="course-duration">Thời gian học {time}</div>

                                <div className="course-price">{cost} vnd</div>
                            </div>
                            <div className="btn-container">
                                <button className="rounded-button">Nhận tư vấn</button>
                                <button className="rounded-button">Mua ngay</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Features */}
            <section className="features-section">
                <div className="container">
                    <div className="row justify-content-center">
                    <h1>Khóa học đem lại</h1>

                        <div className="col-md-4 text-center">
                            <div className="feature-box">
                                <img src="path_to_icon1.png" alt="Icon 1" />
                                <h4>300,000 + sinh viên, người đi làm đã trải nghiệm và thành công với khóa học Online</h4>
                            </div>
                        </div>
                        <div className="col-md-4 text-center">
                            <div className="feature-box" style={{ backgroundColor: '#e1f7d5' }}>
                                <img src="path_to_icon2.png" alt="Icon 2" />
                                <h4>Cung đầy đủ kiến thức và kĩ năng làm đề thi JLPT N5 chỉ trong duy nhất 1 khóa học</h4>
                            </div>
                        </div>
                        <div className="col-md-4 text-center">
                            <div className="feature-box" style={{ backgroundColor: '#d0e9ff' }}>
                                <img src="path_to_icon3.png" alt="Icon 3" />
                                <h4>Lộ trình học được cá nhân hóa đầu tiên tại Việt Nam, hỗ trợ đắc lực cho người tự học</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Additional Information */}
  
         
        </>
    );
};

export default KhoaN5;
