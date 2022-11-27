import { useCallback, useEffect, useState } from 'react';
import useWords from './useWords';
import useCountdownTimer from './useCountdownTimer';
import useTypings from './useTypings';

const NUMBER_OF_WORDS = 15;
const COUNTDOWN_SECONDS = 25;

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

  const isStarting = state === 'start' && cursor > 0;

  const areWordsFinished = correctTyped.current === words.length;
  const restart = useCallback(() => {
    resetCountdown();
    resetTotalTyped();
    setState('start');

    updateWords();
    clearTyped();
  }, [clearTyped, updateWords, resetCountdown, resetTotalTyped]);

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

      resetCountdown();
    }
  }, [timeLeft, state]);

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
    restart,
    timeLeft,
    totalTyped,
    replay,
    COUNTDOWN_SECONDS,
    errorIndex,
  };
};

export default useEngine;
