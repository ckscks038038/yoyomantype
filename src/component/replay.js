import cn from 'classnames';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Caret from './Caret';

const Replay = ({ state, text, ans }) => {
  const [currentWord, setCurrentWord] = useState('');
  const index = useRef(0);

  useEffect(() => {
    const word = text[index.current] ? text[index.current].word : '';
    const time = text[index.current] ? text[index.current].time : 0;

    const timeoutId = setTimeout(() => {
      //寫判斷：Backspace, space要如何處理？
      if (state === 'finish') {
        if (word === 'x') {
          setCurrentWord((prev) => {
            return prev.slice(0, -1);
          });
        } else {
          setCurrentWord((prev) => {
            return prev + word;
          });
        }

        index.current += 1;
      }
    }, time);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentWord, text, state]);

  const typedCharacters = currentWord.split('');

  if (state !== 'finish') {
    return null;
  } else {
    return (
      <div className={' inset-0'}>
        {typedCharacters.map((char, index) => {
          return (
            <Character
              key={`${char}_${index}`}
              actual={char}
              expected={ans[index]}
            />
          );
        })}
        <Caret />
      </div>
    );
  }
};

const Character = ({ actual, expected }) => {
  const isCorrect = actual === expected;
  const isWhiteSpace = expected === ' ';

  return (
    <span
      className={cn({
        'text-red-500': !isCorrect && !isWhiteSpace,
        'text-primary-400': isCorrect && !isWhiteSpace,
        'bg-red-500/50': !isCorrect && isWhiteSpace,
      })}>
      {expected}
    </span>
  );
};
export default Replay;
