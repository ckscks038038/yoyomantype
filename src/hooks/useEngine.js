import { useCallback, useEffect, useState } from 'react';
import useWords from './useWords';
import useCountdownTimer from './useCountdownTimer';
import useTypings from './useTypings';
import { countErrors } from '../utils/helper';

const NUMBER_OF_WORDS = 5;
const COUNTDOWN_SECONDS = 20;

const useEngine = () => {
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
    correctTyped,
    errorIndex,
  } = useTypings(state !== 'finish', words);

  const [errors, setErrors] = useState(0);

  const isStarting = state === 'start' && cursor > 0;

  const areWordsFinished = correctTyped.current === words.length;
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

  // 時間到、state===finish 就停止
  useEffect(() => {
    if ((!timeLeft && state === 'run') || areWordsFinished) {
      setState('finish');
      sumErrors();
      resetCountdown();
    }
  }, [timeLeft, state, sumErrors]);

  /**
   * when the current words are all filled up,
   * we generate and show another set of words
   */
  // useEffect(() => {
  //   if (areWordsFinished) {
  //     sumErrors();
  //     updateWords();
  //     clearTyped();
  //   }
  // }, [clearTyped, areWordsFinished, updateWords, sumErrors]);

  return {
    state,
    words,
    setWords,
    typed,
    errors,
    restart,
    timeLeft,
    totalTyped,
    replay,
    COUNTDOWN_SECONDS,
    errorIndex,
  };
};

export default useEngine;
