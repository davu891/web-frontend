import React from 'react';
import PropTypes from 'prop-types';
import './ProgressBar.css';

const ProgressBar = ({ progress }) => {
  const progressBarStyle = {
    width: `${progress}%`,
    backgroundColor: progress === 0 ? '#b0b0b0' : '#76c7c0', // màu xám khi progress bằng 0, và màu xanh khi khác 0
  };

  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div className="progress" style={progressBarStyle}></div>
      </div>
      <span className="progress-text">{progress}%</span>
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
};

export default ProgressBar;
