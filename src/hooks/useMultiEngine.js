import { useCallback, useEffect, useState } from 'react';
import useWords from './useWords';
import useCountdownTimer from './useCountdownTimer';
import useMultiTypings from './useMultiTyping';
import { countErrors } from '../utils/helper';

const NUMBER_OF_WORDS = 10;
const COUNTDOWN_SECONDS = 20000;

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
  } = useMultiTypings(state !== 'finish', words);

  const [errors, setErrors] = useState(0);

  const isStarting = state === 'start' && cursor > 0;

  const areWordsFinished = cursor === words.length;

  const restart = useCallback(() => {
    resetCountdown();
    resetTotalTyped();
    setState('start');
    setErrors(0);
    updateWords();
    clearTyped();
  }, [clearTyped, updateWords, resetCountdown, resetTotalTyped]);

  const sumErrors = useCallback(() => {
    const wordsReached = words.substring(0, Math.min(cursor, words.length));
    setErrors((prevErrors) => prevErrors + countErrors(typed, wordsReached));
  }, [typed, words, cursor]);

  // as soon the user starts typing the first letter, we start
  useEffect(() => {
    if (isStarting) {
      setState('run');
      startCountdown();
    }
  }, [isStarting, startCountdown]);

  // 時間到，狀態改成finished
  useEffect(() => {
    if (!timeLeft && state === 'run') {
      setState('finish');
      sumErrors();
    }
  }, [timeLeft, state, sumErrors]);

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
    timeLeft,
    totalTyped,
    replay,
    setState,
    keydownHandler,
  };
};

export default useMultiEngine;
