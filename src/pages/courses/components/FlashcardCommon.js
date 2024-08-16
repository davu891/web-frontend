import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './Flashcard.css';

const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
};

const FlashcardCommon = ({ kanjiList, renderContent }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [currentCard, setCurrentCard] = useState(0);
    const [isShuffled, setIsShuffled] = useState(false);
    const [isReversed, setIsReversed] = useState(false);
    const [displayedVocab, setDisplayedVocab] = useState(kanjiList);
    const [isPlaying, setIsPlaying] = useState(false);
    const [studyMode, setStudyMode] = useState(false);
    const [unlearnedWords, setUnlearnedWords] = useState([]);
    const [isStudyFinished, setIsStudyFinished] = useState(false);

    useEffect(() => {
        setDisplayedVocab(isShuffled ? shuffleArray(kanjiList) : kanjiList);
        setCurrentCard(0);
        setIsFlipped(false);
        setUnlearnedWords([]);
        setIsStudyFinished(false);
    }, [isShuffled, kanjiList]);

    useEffect(() => {
        let autoplay;
        if (isPlaying) {
            autoplay = setInterval(() => {
                handleNext();
            }, 2000);
        }
        return () => clearInterval(autoplay);
    }, [isPlaying, currentCard]);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        if (currentCard < displayedVocab.length - 1) {
            setCurrentCard(currentCard + 1);
            setIsFlipped(false);
        } else {
            setIsPlaying(false);
            if (studyMode) {
                setIsStudyFinished(true);
                Swal.fire({
                    title: 'Bạn có muốn học lại những từ chưa thuộc?',
                    showDenyButton: true,
                    confirmButtonText: 'Có',
                    denyButtonText: 'Không',
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (unlearnedWords.length > 0) {
                            setDisplayedVocab(unlearnedWords);
                            setUnlearnedWords([]);
                            setCurrentCard(0);
                            setIsFlipped(false);
                            setIsStudyFinished(false);
                        } else {
                            Swal.fire({
                                title: 'Chúc mừng!',
                                text: 'Bạn đã thuộc hết từ vựng của bài này!',
                                icon: 'success',
                                confirmButtonText: 'OK'
                            }).then(() => {
                                resetFlashcard();
                            });
                        }
                    } else {
                        setStudyMode(false);
                        setIsStudyFinished(false);
                    }
                });
            }
        }
    };

    const handleBack = () => {
        if (currentCard > 0) {
            setCurrentCard(currentCard - 1);
            setIsFlipped(false);
        }
    };

    const handleUnlearned = () => {
        setUnlearnedWords([...unlearnedWords, displayedVocab[currentCard]]);
        handleNext();
    };

    useEffect(() => {
        const flashcardContainer = document.querySelector('.flashcard-container');
        flashcardContainer.classList.remove('fade-in');
        setTimeout(() => {
            flashcardContainer.classList.add('fade-in');
        }, 50);
    }, [currentCard]);

    const resetFlashcard = () => {
        setIsFlipped(false);
        setCurrentCard(0);
        setIsShuffled(false);
        setIsReversed(false);
        setDisplayedVocab(kanjiList);
        setIsPlaying(false);
        setStudyMode(false);
        setUnlearnedWords([]);
        setIsStudyFinished(false);
    };

    const speak = (text, e) => {
        e.stopPropagation();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP'; // Đặt ngôn ngữ là tiếng Nhật
        window.speechSynthesis.speak(utterance);
    };

    const currentVocab = displayedVocab[currentCard];

    return (
        <div className="flashcard-wrapper">
            <div className="control-panel">
                <label>
                    <span>Xáo trộn</span>
                    <Switch
                        onChange={() => setIsShuffled(!isShuffled)}
                        checked={isShuffled}
                        offColor="#888"
                        onColor="#06D6A0"
                        uncheckedIcon={false}
                        checkedIcon={false}
                    />
                </label>
                <label style={{ marginLeft: '20px' }}>
                    <span>Đảo mặt</span>
                    <Switch
                        onChange={() => setIsReversed(!isReversed)}
                        checked={isReversed}
                        offColor="#888"
                        onColor="#06D6A0"
                        uncheckedIcon={false}
                        checkedIcon={false}
                    />
                </label>
                <label style={{ marginLeft: '20px' }}>
                    <span>Học thuộc</span>
                    <Switch
                        onChange={() => setStudyMode(!studyMode)}
                        checked={studyMode}
                        offColor="#888"
                        onColor="#06D6A0"
                        uncheckedIcon={false}
                        checkedIcon={false}
                    />
                </label>
            </div>
            <div className="progress-bar">
                <div className="progress" style={{ width: `${(currentCard / displayedVocab.length) * 100}%` }}></div>
            </div>
            {currentVocab ? (
                <div className={`flashcard-container ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
                    {renderContent(currentVocab, isReversed, speak)}
                </div>
            ) : (
                <div className="flashcard-container">
                    <h2>Chúc mừng! Bạn đã thuộc hết từ vựng của bài này!</h2>
                </div>
            )}
            {studyMode ? (
                <div className="study-navigation">
                    <button className="study-button" onClick={handleUnlearned}>Chưa thuộc</button>
                    <span className="study-counter">{currentCard + 1} / {displayedVocab.length}</span>
                    <button className="study-button" onClick={handleNext}>Đã thuộc</button>
                </div>
            ) : (
                <div className="card-navigation">
                    <button className="nav-button" onClick={handleBack}>&#8592;</button>
                    <span className="card-counter">{currentCard + 1} / {displayedVocab.length}</span>
                    <button className="nav-button" onClick={handleNext}>&#8594;</button>
                    <button 
                        className="autoplay-button" 
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                </div>
            )}
            {unlearnedWords.length > 0 && (
                <div className="unlearned-words">
                    <h3>({unlearnedWords.length}) Từ chưa thuộc:</h3>
                    <ul>
                        {unlearnedWords.map((word, index) => (
                            <li key={index}>{word.chu_han} - {word.han_viet} - {word.y_nghia}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FlashcardCommon;
