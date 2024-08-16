import React, { useState } from 'react'; // Xóa khai báo trùng lặp
import FlashcardCommon from './FlashcardCommon';
import { FaVolumeUp } from 'react-icons/fa';
import './Flashcard.css';

const FlashcardA = ({ kanjiList }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const handleFlip = () => setIsFlipped(!isFlipped);

    // Hàm render nội dung thẻ flashcard
    const renderContent = (vocab, isReversed, speak) => (
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
            {isReversed ? (
                <>
                     <div className="front">
                        <h2>{vocab.han_viet}</h2>
                      
                    </div>
                    <div className="back">
                        <h2>{vocab.chu_han}</h2>
                        <p>{vocab.y_nghia}</p>
                    </div>
                </>
            ) : (
                <>
                 <div className="front">
                        <h2>{vocab.chu_han}</h2>
                    </div>
                    <div className="back">
                        <h2 className="kanji">{vocab.han_viet}</h2>
                       
                        <p>{vocab.y_nghia}</p>
                    </div>
                   
                </>
            )}
                 <button className="speak-button" onClick={(e) => speak(vocab.chu_han, e)}>
                            <FaVolumeUp />
                        </button>
                        <div className="hole"></div>
        </div>
    );

    return <FlashcardCommon kanjiList={kanjiList} renderContent={renderContent} />;
};

export default FlashcardA;
