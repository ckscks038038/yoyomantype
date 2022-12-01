import { useCallback, useEffect, useState, useRef } from 'react';
import useWords from './useWords';
import useCountdownTimer from './useCountdownTimer';
import useTypings from './useTypings';
import { calculateAccuracyPercentage, InsertGameRecord } from '../utils/helper';

const NUMBER_OF_WORDS = 10;
const COUNTDOWN_SECONDS = 17;

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

  const areWordsFinished =
    correctTyped.current === words.length ||
    cursor === words.length ||
    !timeLeft;
  const endTime = (replay[replay.length - 1]?.time - replay[0]?.time) / 1000;
  const time = Math.min(COUNTDOWN_SECONDS, endTime);
  const getAcc = calculateAccuracyPercentage(
    Object.keys(errorIndex.current).length,
    totalTyped
  );
  const getCpm = Math.trunc((totalTyped / time) * 60);
  const indexReferToWord = useRef({});
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

  //打完字, 計算有哪些錯字, 錯在什麼字
  useEffect(() => {
    if (areWordsFinished) {
      const wrongWordIndexArr = Object.keys(errorIndex.current);

      const wrongWordResultArr = wrongWordIndexArr.map((i) => {
        return indexReferToWord.current[i];
      });
      console.log('wrongWordResultArr', wrongWordResultArr);
    }

    //取完資料清空indexReferToWord.current
    indexReferToWord.current = {};
  }, [areWordsFinished]);

  // 分析words中每個字元屬於哪個字
  useEffect(() => {
    const getEachWord = words.split(' ');
    const wordsArr = [...words];
    let wordNum = 0;

    wordsArr.forEach((char, index) => {
      if (char !== ' ') {
        indexReferToWord.current[`${index}`] = getEachWord[wordNum];
      } else {
        wordNum += 1;
      }
    });
  }, [words]);
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
