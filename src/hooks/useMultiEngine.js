import { useCallback, useEffect, useState } from 'react';
import useWords from './useWords';
import useCountdownTimer from './useCountdownTimer';
import useMultiTypings from './useMultiTyping';
import { countErrors } from '../utils/helper';

const NUMBER_OF_WORDS = 12;

const useMultiEngine = () => {
  const [state, setState] = useState('start');
  const { words, updateWords, setWords } = useWords(NUMBER_OF_WORDS);

  const {
    typed,
    cursor,
    clearTyped,
    resetTotalTyped,
    totalTyped,
    replay,
    keydownHandler,
    correctTyped,
  } = useMultiTypings(state !== 'finish', words);

  const [errors, setErrors] = useState(0);

  const isStarting = state === 'start' && cursor > 0;

  const areWordsFinished =
    cursor === words.length && correctTyped.current === words.length;

  const restart = useCallback(() => {
    resetTotalTyped();
    setState('start');
    setErrors(0);
    updateWords();
    clearTyped();
  }, [clearTyped, updateWords, resetTotalTyped]);

  const sumErrors = useCallback(() => {
    const wordsReached = words.substring(0, Math.min(cursor, words.length));
    setErrors((prevErrors) => prevErrors + countErrors(typed, wordsReached));
  }, [typed, words, cursor]);

  //當使用者開始打字, 把狀態改成run
  useEffect(() => {
    if (isStarting) {
      setState('run');
    }
  }, [isStarting]);

  //字都打完，刷新一組新字
  useEffect(() => {
    if (areWordsFinished) {
      sumErrors();
      clearTyped();
    }
  }, [clearTyped, areWordsFinished, updateWords, sumErrors]);

  return {
    state,
    words,
    setWords,
    updateWords,
    typed,
    clearTyped,
    resetTotalTyped,
    errors,
    restart,
    totalTyped,
    replay,
    setState,
    keydownHandler,
    correctTyped,
  };
};

export default useMultiEngine;
