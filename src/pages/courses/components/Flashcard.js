import React, { useState } from 'react'; // Xóa khai báo trùng lặp
import FlashcardCommon from './FlashcardCommon';
import { FaVolumeUp } from 'react-icons/fa';
import './Flashcard.css';

const FlashcardB = ({ kanjiList }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const handleFlip = () => setIsFlipped(!isFlipped);

    // Hàm render nội dung thẻ flashcard
    const renderContent = (vocab, isReversed, speak) => (
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
            {isReversed ? (
                <>
                     <div className="front">
                        <h2>{vocab.nghia}</h2>
                      
                    </div>
                    <div className="back">
                        <h2>{vocab.kanji}</h2>
                        <p>{vocab.tu_vung}</p>
                    </div>
                </>
            ) : (
                <>
                 <div className="front">
                 <h2>{vocab.kanji}</h2>
                        <p>{vocab.tu_vung}</p>
                    </div>
                    <div className="back">
                        <h2 className="kanji">{vocab.nghia}</h2>
                       
                    </div>
                   
                </>
            )}
                 <button className="speak-button" onClick={(e) => speak(vocab.tu_vung, e)}>
                            <FaVolumeUp />
                        </button>
                        <div className="hole"></div>
        </div>
    );

    return <FlashcardCommon kanjiList={kanjiList} renderContent={renderContent} />;
};

export default FlashcardB;
