import { useCallback, useEffect, useState } from 'react';
import useWords from './useWords';
import useCountdownTimer from './useCountdownTimer';
import useMultiTypings from './useMultiTyping';
import { countErrors } from '../utils/helper';

const NUMBER_OF_WORDS = 12;
const COUNTDOWN_SECONDS = 3;
const useMultiEngine = () => {
  const [state, setState] = useState('start');
  const { words, updateWords, setWords } = useWords(NUMBER_OF_WORDS);

  const { timeLeft, startCountdown, resetCountdown } =
    useCountdownTimer(COUNTDOWN_SECONDS);
  const {
    typed,
    cursor,
    clearTyped,
    resetTotalTyped,
    totalTyped,
    replay,
    keydownHandler,
    correctTyped,
  } = useMultiTypings(state !== 'finish' && state !== 'start', words);

  const [errors, setErrors] = useState(0);

  const areWordsFinished =
    cursor === words.length && correctTyped.current === words.length;

  //開始新的一局前，重製所有設定
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
    COUNTDOWN_SECONDS,
    timeLeft,
    startCountdown,
    resetCountdown,
  };
};

export default useMultiEngine;
