import React, { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // ms per char
  isLatest?: boolean; // Only animate if it's the current/latest generated text
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 20,
  isLatest = true,
  onComplete,
  className = '',
  style = {}
}) => {
  // If it's a historical/existing message (isLatest === false), display full text immediately
  const [displayedLength, setDisplayedLength] = useState(isLatest ? 0 : text.length);
  const onCompleteCalledRef = useRef(false);

  useEffect(() => {
    if (!isLatest) {
      setDisplayedLength(text.length);
    } else {
      setDisplayedLength(0);
      onCompleteCalledRef.current = false;
    }
  }, [text, isLatest]);

  useEffect(() => {
    if (!isLatest) return;

    if (displayedLength < text.length) {
      const timer = setTimeout(() => {
        setDisplayedLength(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (displayedLength >= text.length && !onCompleteCalledRef.current) {
      onCompleteCalledRef.current = true;
      if (onComplete) onComplete();
    }
  }, [displayedLength, text, speed, isLatest, onComplete]);

  if (!isLatest || displayedLength >= text.length) {
    return (
      <span className={className} style={{ whiteSpace: 'pre-wrap', ...style }}>
        {text}
      </span>
    );
  }

  const currentText = text.slice(0, displayedLength);

  return (
    <span className={className} style={{ whiteSpace: 'pre-wrap', ...style }}>
      {currentText}
      <span className="typewriter-cursor">▌</span>
    </span>
  );
};
