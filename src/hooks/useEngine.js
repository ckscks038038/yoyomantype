import { useCallback, useEffect, useState } from 'react';
import useWords from './useWords';
import useCountdownTimer from './useCountdownTimer';
import useTypings from './useTypings';
import { countErrors } from '../utils/helper';

const NUMBER_OF_WORDS = 15;
const COUNTDOWN_SECONDS = 30;

const useEngine = () => {
  const [state, setState] = useState('start');
  const { words, updateWords } = useWords(NUMBER_OF_WORDS);
  const { timeLeft, startCountdown, resetCountdown } =
    useCountdownTimer(COUNTDOWN_SECONDS);
  const { typed, cursor, clearTyped, resetTotalTyped, totalTyped } = useTypings(
    state !== 'finish'
  );

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

  // when the time is up, we've finished
  useEffect(() => {
    if (!timeLeft && state === 'run') {
      setState('finish');
      sumErrors();
    }
  }, [timeLeft, state, sumErrors]);

  /**
   * when the current words are all filled up,
   * we generate and show another set of words
   */
  useEffect(() => {
    if (areWordsFinished) {
      sumErrors();
      updateWords();
      clearTyped();
    }
  }, [clearTyped, areWordsFinished, updateWords, sumErrors]);

  return { state, words, typed, errors, restart, timeLeft, totalTyped };
};

export default useEngine;
