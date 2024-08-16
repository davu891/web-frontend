import React, { useState, useEffect } from 'react';
import './CardMatching.css';
import Modal from 'react-modal';
Modal.setAppElement('#root');

// Hàm để trộn ngẫu nhiên một mảng
const shuffleArray = (array) => {
    let shuffledArray = array.slice(); // Tạo một bản sao của mảng
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
};

const CardMatching = ({ kanjiList }) => {
    const [shuffledKanjiList, setShuffledKanjiList] = useState([]);
    const [shuffledChuHan, setShuffledChuHan] = useState([]);
    const [activeBox, setActiveBox] = useState(null);
    const [boxes, setBoxes] = useState(Array(6).fill(null));
    const [visibleKanji, setVisibleKanji] = useState(Array(6).fill(true));
    const [boxStatus, setBoxStatus] = useState(Array(6).fill(null));
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);
    
    
    // Hàm khởi tạo lại trò chơi (được sử dụng trong reset)
    const initializeGame = () => {
        const shuffledList = shuffleArray(kanjiList).slice(0, 6);
        setShuffledKanjiList(shuffledList);
        setShuffledChuHan(shuffleArray(shuffledList.map(item => item.chu_han)));
        setActiveBox(null);
        setBoxes(Array(6).fill(null));
        setVisibleKanji(Array(6).fill(true));
        setBoxStatus(Array(6).fill(null));
    };

    useEffect(() => {
        initializeGame();
    }, [kanjiList]);

    // Hàm xử lý khi bấm vào ô trống
    const handleBoxClick = (index) => {
        if (activeBox === null) {
            setActiveBox(index);
        } else {
            const updatedBoxes = [...boxes];
            const temp = updatedBoxes[activeBox];
            updatedBoxes[activeBox] = updatedBoxes[index];
            updatedBoxes[index] = temp;
            setBoxes(updatedBoxes);
            setActiveBox(null);
        }
    };

    // Hàm xử lý khi bấm vào chữ Kanji
    const handleKanjiClick = (kanji, kanjiIndex) => {
        const firstEmptyIndex = boxes.findIndex(box => box === null);

        if (firstEmptyIndex !== -1) {
            const updatedBoxes = boxes.map((box, idx) => 
                idx === firstEmptyIndex ? kanji : box
            );
            setBoxes(updatedBoxes);

            const updatedVisibleKanji = visibleKanji.map((visible, idx) => 
                idx === kanjiIndex ? false : visible
            );
            setVisibleKanji(updatedVisibleKanji);

            setActiveBox(null);
        }
    };

    // Hàm kiểm tra đáp án
    const checkAnswers = () => {
        let correctCount = 0;
        const updatedBoxStatus = boxes.map((box, index) => {
            if (box === shuffledKanjiList[index].chu_han) {
                correctCount++;
                return 'correct';
            } else {
                return 'incorrect';
            }
        });

        setBoxStatus(updatedBoxStatus);

        alert(`Bạn đã đúng ${correctCount} trên ${boxes.length} câu.`);
    };

    // Hàm reset trò chơi
    const resetGame = () => {
        initializeGame();
    };

    return (
        <div className="card-matching">
            <button className="instructions-button" onClick={openModal}>
                Hướng dẫn chơi
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Hướng dẫn chơi"
                className="modal"
                overlayClassName="overlay"
            >
                <h2>Hướng dẫn chơi</h2>
                <p>1. Bấm vào chữ Kanji phía trên để điền vào các ô trống.</p>
                <p>2. Bạn có thể hoán đổi vị trí các ô trống đã điền bằng cách bấm vào chúng.</p>
                <p>3. Khi hoàn tất, bấm "Kiểm tra đáp án" để xem kết quả.</p>
                <p>4. Bấm "Reset" để chơi lại từ đầu.</p>
                <button onClick={closeModal}>Đóng</button>
            </Modal>
            <div className="kanji-box">
                {shuffledChuHan.map((kanji, index) => (
                    visibleKanji[index] && (
                        <div
                            key={index}
                            className="kanji-item"
                            onClick={() => handleKanjiClick(kanji, index)}
                        >
                            {kanji}
                        </div>
                    )
                ))}
            </div>
            <div className="vocab-and-boxes">
                {shuffledKanjiList.map((item, index) => (
                    <div key={index} className="vocab-and-box-row">
                        <div className="vocab-item">
                            {item.han_viet}
                        </div>
                        <div
                            className={`empty-box ${activeBox === index ? 'active' : ''} ${boxStatus[index]}`}
                            onClick={() => handleBoxClick(index)}
                        >
                            {boxes[index]}
                        </div>
                    </div>
                ))}
            </div>
            <div className="button-group">
                <button className="check-answers-button" onClick={checkAnswers}>
                    Kiểm tra đáp án
                </button>
                <button className="reset-button" onClick={resetGame}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default CardMatching;
