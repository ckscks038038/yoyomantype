import cn from 'classnames';
import Caret from './Caret';
import { useRef, useState } from 'react';
const UserTypings = ({ userInput, className, words, state }) => {
  const typedCharacters = userInput.split('');
  const wordsCharacters = words.split('');
  const typedLen = typedCharacters.length;
  // run過所有打過的字，
  // 如果是typed範圍內，return<Character...actual>
  // 如果是typed範圍外，return<Character...expect, 透明>

  //紀錄錯字
  const count = useRef(0);
  count.current += 1;
  console.log(count.current);
  return (
    <>
      <div className={className}>
        {wordsCharacters.map((char, index) => {
          if (index < typedLen) {
            return (
              <Character
                key={`${char}_${index}`}
                actual={typedCharacters[index]}
                expected={words[index]}
                transparent={0}
              />
            );
          } else {
            return (
              <Character
                key={`${char}_${index}`}
                actual={wordsCharacters[index]}
                expected={words[index]}
                transparent={1}
              />
            );
          }
        })}
      </div>
    </>
  );
};

const Character = ({ actual, expected, transparent }) => {
  const isCorrect = actual === expected;
  const isWhiteSpace = expected === ' ';

  return (
    <span
      className={cn({
        'text-red-500': !isCorrect && !isWhiteSpace && !transparent,
        'text-primary-400': isCorrect && !isWhiteSpace && !transparent,
        'bg-red-500/50': !isCorrect && isWhiteSpace && !transparent,
        'opacity-0': transparent,
      })}>
      {expected}
    </span>
  );
};

export default UserTypings;
