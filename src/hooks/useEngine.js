import { useCallback, useEffect, useState } from 'react';
import useWords from './useWords';
import useCountdownTimer from './useCountdownTimer';
import useTypings from './useTypings';
import { calculateAccuracyPercentage, InsertGameRecord } from '../utils/helper';

const NUMBER_OF_WORDS = 10;
const COUNTDOWN_SECONDS = 15;

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

  const endTime = (replay[replay.length - 1]?.time - replay[0]?.time) / 1000;
  const time = Math.min(COUNTDOWN_SECONDS, endTime);
  const getAcc = calculateAccuracyPercentage(
    Object.keys(errorIndex.current).length,
    totalTyped
  );
  const getCpm = Math.trunc((totalTyped / time) * 60);

  // 時間到就停止, 寫進資料庫
  useEffect(() => {
    if (!timeLeft && state === 'run') {
      setState('finish');
      resetCountdown();
      InsertGameRecord({ acc: getAcc, cpm: getCpm, accounts_id: 66 });
    }
  }, [timeLeft, state, resetCountdown, getAcc, getCpm]);

  // 打完字就停止, 寫進資料庫
  useEffect(() => {
    if (areWordsFinished) {
      setState('finish');
      resetCountdown();

      InsertGameRecord({
        acc: getAcc,
        cpm: getCpm,
      });
    }
  }, [areWordsFinished, resetCountdown, getAcc, getCpm]);

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
