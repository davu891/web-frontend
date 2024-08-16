import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import { useParams } from 'react-router-dom';
import './KanjiDisplay.css'; // Import file CSS
import { FaBook, FaClipboardList, FaPenFancy } from 'react-icons/fa';

// Import các component tương ứng
import Flashcard from './components/Flashcard_kanji'; // Component Flashcard.js (Thẻ ghi nhớ)
import CardMatching from './components/CardMatching'; // Component Ghép thẻ (ví dụ)

const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

const KanjiDisplay = () => {
    const [kanjiList, setKanjiList] = useState([]); // Danh sách Kanji từ CSDL
    const [selectedKanji, setSelectedKanji] = useState(null);
    const [kanjiDetails, setKanjiDetails] = useState(null);
    const { title, unit } = useParams();

    const [currentView, setCurrentView] = useState('hoc'); // Chế độ hiển thị hiện tại (default là học)

    // Lấy danh sách Kanji từ API
    useEffect(() => {
        const fetchKanjiList = async () => {
            try {
                const response = await axios.get(`${apiBaseURL}/api/kanji/${title}/${unit}`);
                setKanjiList(response.data);

                // Set chữ Kanji đầu tiên làm mặc định
                if (response.data.length > 0) {
                    setSelectedKanji(response.data[0].chu_han);
                }
            } catch (error) {
                console.error('Error fetching kanji list:', error);
            }
        };

        fetchKanjiList();
    }, [title, unit]);

    // Lấy thông tin chi tiết của Kanji khi một Kanji được chọn
    useEffect(() => {
        if (selectedKanji) {
            const fetchKanjiDetails = async () => {
                try {
                    const response = await axios.get(`${apiBaseURL}/api/kanji/${selectedKanji}`);
                    setKanjiDetails(response.data);
                } catch (error) {
                    console.error('Error fetching kanji details:', error);
                }
            };

            fetchKanjiDetails();
        }
    }, [selectedKanji]);

    const handleKanjiClick = (kanji) => {
        setSelectedKanji(kanji);
    };

    // Hàm để render component tương ứng với currentView
    const renderContent = () => {
        switch (currentView) {
            case 'hoc':
                return (
                    <>
                        <div className="kanji-list">
                            {kanjiList.map((kanji, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => handleKanjiClick(kanji.chu_han)}
                                    className={`kanji-button ${selectedKanji === kanji.chu_han ? 'selected' : ''}`}
                                >
                                    {kanji.chu_han}
                                </button>
                            ))}
                        </div>

                        <div className="kanji-info-box">
                            <div className="info-section">
                                <h3>Âm Hán —</h3>
                                {selectedKanji && kanjiList.length > 0 && (
                                    <p>{kanjiList.find(kanji => kanji.chu_han === selectedKanji).han_viet}</p>
                                )}
                            </div>
                            <div className="info-section">
                                <h3>Ý nghĩa —</h3>
                                {selectedKanji && kanjiList.length > 0 && (
                                    <p>{kanjiList.find(kanji => kanji.chu_han === selectedKanji).y_nghia}</p>
                                )}
                            </div>
                            {kanjiDetails && (
                                <>
                                    <div className="info-section">
                                        <h3>Bộ thủ —</h3>
                                        <p>{kanjiDetails.radical.symbol} ({kanjiDetails.radical.meaning})</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {kanjiDetails && (
                            <div className="kanji-details">
                                <div className="kanji-stroke-order">
                                    <h4>Cách viết</h4>
                                    <img src={kanjiDetails.strokeOrderGifUri} alt={`Stroke order GIF of ${kanjiDetails.kanji}`} />
                                </div>
                            </div>
                        )}
                    </>
                );
            case 'flashcard':
              return <Flashcard kanjiList={kanjiList} />; // Truyền dữ liệu Kanji vào Flashcard
              case 'ghepthe':
                return <CardMatching kanjiList={kanjiList} />;

            default:
                return null;
        }
    };

    return (
        <div className="kanji-container">
            {/* Gọi hàm renderContent để hiển thị nội dung theo currentView */}
            {renderContent()}

            {/* Thanh float nổi cuối màn hình */}
            <div className="kanji-float-bar">
                <div 
                    className={`kanji-float-box kanji-float-box-1 ${currentView === 'hoc' ? 'active' : ''}`} 
                    onClick={() => setCurrentView('hoc')}
                >
                    <FaBook className="kanji-icon" />
                    <p>Học</p>
                </div>
                <div 
                    className={`kanji-float-box kanji-float-box-2 ${currentView === 'flashcard' ? 'active' : ''}`} 
                    onClick={() => setCurrentView('flashcard')}
                >
                    <FaClipboardList className="kanji-icon" />
                    <p>Thẻ ghi nhớ</p>
                </div>
                <div 
                    className={`kanji-float-box kanji-float-box-3 ${currentView === 'ghepthe' ? 'active' : ''}`} 
                    onClick={() => setCurrentView('ghepthe')}
                >
                    <FaPenFancy className="kanji-icon" />
                    <p>Ghép thẻ</p>
                </div>
            </div>
        </div>
    );
};

export default KanjiDisplay;
