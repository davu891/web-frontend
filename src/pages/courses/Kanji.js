import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import KanjiDisplay from './KanjiDisplay';
import KanjiVocab from './Kanji_vocab';
import KanjiRenshu from './Kanji_renshu';
import './Kanji.css'; // Import file CSS riêng
import Breadcrumb from 'react-bootstrap/Breadcrumb';

// Import các icon bạn cần sử dụng
import { FaBook, FaClipboardList, FaPenFancy } from 'react-icons/fa';

const Kanji = () => {
    const { title, unit } = useParams();
    const navigate = useNavigate();
    
    const [step, setStep] = useState(0); // Bước mặc định là 0 (hiển thị các box lựa chọn)

    const renderStep = () => {
        switch (step) {
            case 1:
                return <KanjiDisplay />;
            case 2:
                return <KanjiVocab />;
            case 3:
                return <KanjiRenshu />;
            default:
                return null;
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleBack = () => {
        setStep(0); // Quay lại bước lựa chọn
    };

    return (
       <>
            <div className="breadcrumb-container">
                <div className="breadcrumb-content">
                    <Breadcrumb>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }} onClick={() => handleNavigate("/")}>Home</Breadcrumb.Item>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/courses/learn/${title}` }} onClick={() => handleNavigate(`/courses/learn/${title}`)}>
                            Khóa học {title}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Từ vựng bài {unit}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
            <div className="kanji-container">
                {step === 0 ? (
                    <div className="kanji-steps">
                        <div className="kanji-step-box kanji-step-box-1" onClick={() => setStep(1)}>
                            <FaBook className="kanji-icon" />
                            <p>Giới thiệu</p>
                        </div>
                        <div className="kanji-step-box kanji-step-box-2" onClick={() => setStep(2)}>
                            <FaClipboardList className="kanji-icon" />
                            <p>Cách đọc</p>
                        </div>
                        <div className="kanji-step-box kanji-step-box-3" onClick={() => setStep(3)}>
                            <FaPenFancy className="kanji-icon" />
                            <p>Vận dụng</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <button className="back-button" onClick={handleBack}>Back</button>
                        <div className="kanji-content">
                            {renderStep()}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Kanji;
