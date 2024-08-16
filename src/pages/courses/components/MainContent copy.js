import React from 'react';
import { FaBars } from 'react-icons/fa';
import Flashcard from './Flashcard';
import Quiz from './Quiz';

const MainContent = ({ currentView, syllabusData, vocabData, grammarData, handleNextStep, handlePreviousStep, getProgressStep, toggleSidebar }) => {
    console.log('Syllabus Data in MainContent:', syllabusData);
    console.log('Vocab Data in MainContent:', vocabData);
    console.log('Grammar Data in MainContent:', grammarData);

    return (
        <div className="main-content">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                <FaBars />
            </button>

            {currentView === 'intro' && (
                syllabusData.length > 0 ? (
                    <>
                        <h1>Nội dung học tập</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Tiêu đề</th>
                                    <th>Mô tả</th>
                                </tr>
                            </thead>
                            <tbody>
                                {syllabusData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.komoku}</td>
                                        <td>{item.naiyo.split('\r\n').map((line, i) => (
                                            <React.Fragment key={i}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <p>No data available</p>
                )
            )}

            {currentView && currentView.includes('_vocab') && (
                <div>
                    <div className='line-container'>
                        <div className='progress-line'>
                            <div className='progress' style={{ width: `${getProgressStep(currentView.match(/learn(\d+)_vocab/)[1]) * 33}%` }}></div>
                            <div className='status'>
                                <div className={`dot ${getProgressStep(currentView.match(/learn(\d+)_vocab/)[1]) >= 1 ? 'completed' : ''}`}></div>
                                <span className="label">List từ vựng</span>
                            </div>
                            <div className='status'>
                                <div className={`dot ${getProgressStep(currentView.match(/learn(\d+)_vocab/)[1]) >= 2 ? 'completed' : ''}`}></div>
                                <span className="label">Flashcard</span>
                            </div>
                            <div className='status'>
                                <div className={`dot ${getProgressStep(currentView.match(/learn(\d+)_vocab/)[1]) >= 3 ? 'completed' : ''}`}></div>
                                <span className="label">Quiz</span>
                            </div>
                        </div>
                    </div>
                    
                    {getProgressStep(currentView.match(/learn(\d+)_vocab/)[1]) === 1 && (
                        <>
                            <h2>Danh sách Từ vựng bài {currentView.match(/learn(\d+)_vocab/)[1]}</h2>
                            {vocabData.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Thể loại</th>
                                            <th>Từ vựng</th>
                                            <th>Kanji</th>
                                            <th>Nghĩa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vocabData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.the_loai}</td>
                                                <td>{item.tu_vung}</td>
                                                <td>{item.kanji}</td>
                                                <td>{item.nghia}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No vocabulary available</p>
                            )}
                            <div className="floating-container">
                                <button onClick={() => handleNextStep(currentView.match(/learn(\d+)_vocab/)[1])}>Hoàn thành</button>
                            </div>
                        </>
                    )}
                    {getProgressStep(currentView.match(/learn(\d+)_vocab/)[1]) === 2 && (
                        <>
                            <h2>Flashcard Từ vựng bài {currentView.match(/learn(\d+)_vocab/)[1]}</h2>
                            <Flashcard />
                            <div className="floating-container">
                                <button onClick={() => handlePreviousStep(currentView.match(/learn(\d+)_vocab/)[1])}>Back</button>
                                <button onClick={() => handleNextStep(currentView.match(/learn(\d+)_vocab/)[1])}>Hoàn thành</button>
                            </div>
                        </>
                    )}
                    {getProgressStep(currentView.match(/learn(\d+)_vocab/)[1]) === 3 && (
                        <>
                            <Quiz />
                            <div className="floating-container">
                                <button onClick={() => handlePreviousStep(currentView.match(/learn(\d+)_vocab/)[1])}>Back</button>
                                <button onClick={() => alert('Kết thúc')}>Kết thúc</button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {currentView && currentView.includes('_grammar') && (
                <div>
                    <h2>Ngữ pháp Buổi {currentView.match(/learn(\d+)_grammar/)[1]}</h2>
                    {grammarData.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mẫu câu</th>
                                    <th>Cấu trúc</th>
                                    <th>Cách dùng JP</th>
                                    <th>Cách dùng TV</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grammarData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.stt}</td>
                                        <td>{item.mau_cau}</td>
                                        <td>{item.cau_truc}</td>
                                        <td>{item.cach_dung_jp}</td>
                                        <td>{item.cach_dung_tv}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No grammar available</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default MainContent;
