import React from 'react';
import './Furigana.css';

const Furigana = ({ text }) => {
  const regex = /(.*?)([一-龠々〆ヵヶ]+)【([^】]+)】(.*)/;

  const renderText = (inputText) => {
    const lines = inputText.split('\n');
    const renderedLines = lines.map((line, index) => {
      const parts = [];
      let remainingText = line;
      let match;

      while ((match = regex.exec(remainingText)) !== null) {
        const [fullMatch, before, kanji, furigana, after] = match;
        parts.push(before);
        parts.push(
          <ruby key={kanji}>
            
            <rt>{furigana}</rt>
            {kanji}
          </ruby>
        );
        remainingText = after;
      }

      parts.push(remainingText);

      return (
        <div key={index}>
          {parts}
        </div>
      );
    });

    return renderedLines;
  };

  return <div className="furigana-text">{renderText(text)}</div>;
};

export default Furigana;
