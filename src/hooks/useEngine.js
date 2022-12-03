import { useCallback, useEffect, useState, useRef } from 'react';
import useWords from './useWords';
import useCountdownTimer from './useCountdownTimer';
import useTypings from './useTypings';
import {
  calculateAccuracyPercentage,
  consecutiveRanges,
  FuzzySearch,
  InsertGameRecord,
  QueryString,
} from '../utils/helper';
import { toast } from 'react-toastify';

const NUMBER_OF_WORDS = 10;
const COUNTDOWN_SECONDS = 15;

const useEngine = () => {
  const [state, setState] = useState('start');
  const { words, updateWords, setWords } = useWords(NUMBER_OF_WORDS);
  let testArr = useRef([]);
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

  const updatePracticeWords = useCallback(() => {
    let string = '';
    const wordsLength = testArr.current.length;

    // 字長度不超過NUMBER_OF_WORDS
    // 超過就隨機選取NUMBER_OF_WORDS個出來
    if (wordsLength <= NUMBER_OF_WORDS) {
      testArr.current.forEach((word, index) => {
        string += index === wordsLength ? word : word + ' ';
      });
    } else {
      for (let index = 1; index <= NUMBER_OF_WORDS; index += 1) {
        // generate random number within wordsLength
        const randomNum = Math.floor(Math.random() * NUMBER_OF_WORDS);

        // append it to string
        string +=
          index === NUMBER_OF_WORDS
            ? testArr.current[randomNum]
            : testArr.current[randomNum] + ' ';
      }
    }

    setWords(string);
  }, [setWords]);

  const restartPractice = useCallback(() => {
    resetCountdown();
    resetTotalTyped();
    setState('start');

    testArr.current[0] ? updatePracticeWords() : updateWords();
    testArr.current[0]
      ? toast.success('🦄 Practice makes perfect!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          toastId: "Room doesn't exist.",
        })
      : toast.success('🦄 You are perfect typer!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          toastId: "Room doesn't exist.",
        });
    clearTyped();
  }, [
    clearTyped,
    updatePracticeWords,
    resetCountdown,
    resetTotalTyped,
    updateWords,
  ]);

  // 開始時啟動倒數
  useEffect(() => {
    if (isStarting) {
      setState('run');
      startCountdown();

      testArr.current = [];
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

      // 找出連續的range: {start:"index", start:"index"}
      const consecutiveWrongChar = consecutiveRanges(wrongWordIndexArr);

      // 1. queryString
      if (consecutiveWrongChar[0]) {
        let wrongCharArr = consecutiveWrongChar.map((obj) => {
          const [start, end] = [obj.start, obj.end];
          const targetSection = words.slice(start, parseInt(end) + 1);
          return targetSection;
        });
        // 拿targetSection call getQueryStringWords撈資料
        const fetchQueryStringData = async (wrongCharArr) => {
          const wrongCharArrPromise = wrongCharArr.map((charSection) => {
            return QueryString({ word: charSection });
          });
          wrongCharArr = await Promise.all(wrongCharArrPromise);

          const wrongWords = [];
          wrongCharArr.forEach((arr) => {
            arr.forEach((element) => {
              wrongWords.push(element);
            });
          });

          testArr.current = [...testArr.current, ...wrongWords];
          // console.log('錯字推薦的testArr', testArr.current);
          // console.log('錯字推薦', wrongWords);
        };
        fetchQueryStringData(wrongCharArr);
      }

      // 2. 模糊搜尋
      let wrongWordResultArr = wrongWordIndexArr.map((i) => {
        return indexReferToWord.current[i];
      });

      wrongWordResultArr = [...new Set(wrongWordResultArr)];

      const fetchFuzzyData = async () => {
        const FuzzyWordsArrPromise = wrongWordResultArr.map((wrongWord) => {
          return FuzzySearch({ word: wrongWord });
        });
        const FuzzyWordsArr = await Promise.all(FuzzyWordsArrPromise);
        const wrongWords = [];
        FuzzyWordsArr.forEach((arr) => {
          arr.forEach((element) => {
            wrongWords.push(element);
          });
        });
        // console.log('模糊推薦', wrongWords);
        // console.log('模糊推薦的testArr', testArr.current);
        testArr.current = [...testArr.current, ...wrongWords];
      };
      fetchFuzzyData();
    }

    //取完資料清空indexReferToWord.current
    // indexReferToWord.current = {};
  }, [areWordsFinished, errorIndex, words]);

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
    restartPractice,
  };
};

export default useEngine;
