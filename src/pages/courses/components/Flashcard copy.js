import React, { useState } from 'react';
import './Flashcard.css';

const Flashcard = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [currentCard, setCurrentCard] = useState(5); // Example starting point
    const totalCards = 30; // Example total cards

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        if (currentCard < totalCards) {
            setCurrentCard(currentCard + 1);
            setIsFlipped(false); // Reset flip on navigation
        }
    };

    const handleBack = () => {
        if (currentCard > 1) {
            setCurrentCard(currentCard - 1);
            setIsFlipped(false); // Reset flip on navigation
        }
    };

    return (
        <div className="flashcard-wrapper">
                       <div className="progress-bar">
                <div className="progress" style={{ width: `${(currentCard / totalCards) * 100}%` }}></div>
            </div>
            <div className={`flashcard-container ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
                <div className="flashcard">
                    <div className="front">
                        <h2>Mặt trước</h2>
                        <p>Nội dung mặt trước</p>
                    </div>
                    <div className="back">
                        <h2>Mặt sau</h2>
                        <p>Nội dung mặt sau</p>
                    </div>
                </div>
            </div>
            <div className="card-navigation">
                <button className="nav-button" onClick={handleBack}>&#8592;</button>
                <span className="card-counter">{currentCard} / {totalCards}</span>
                <button className="nav-button" onClick={handleNext}>&#8594;</button>
            </div>
 
        </div>
    );
};

export default Flashcard;
