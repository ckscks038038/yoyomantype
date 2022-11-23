import { useCallback, useEffect, useState, useRef } from 'react';

// 只接受 英文字母、數字、回車或空白鍵
const isKeyboardCodeAllowed = (code) => {
  return (
    code.startsWith('Key') ||
    code.startsWith('Digit') ||
    code === 'Backspace' ||
    code === 'Space'
  );
};

const useMultiTypings = (enabled, words) => {
  const [cursor, setCursor] = useState(0);
  const [typed, setTyped] = useState('');
  const [replay, setReplay] = useState([]);
  const typedRef = useRef('');
  const totalTyped = useRef(0);
  const correctTyped = useRef(0);
  const keydownHandler = useCallback(
    ({ key, code }) => {
      if (!enabled || !isKeyboardCodeAllowed(code)) {
        return;
      }
      /**
       * 紀錄按下字的時間以及按下的字為何,
       * 儲存資料到localstorage
       * Date.now()=> milliseconds elapsed since January 1, 1970 00:00:00 UTC.
       */
      setReplay((prev) => {
        const currentreplay = { word: key, time: Date.now() };
        return [...prev, currentreplay];
      });

      switch (key) {
        case 'Backspace':
          //刪到對的字要扣掉
          if (
            correctTyped.current > 0 &&
            typedRef.current[totalTyped.current - 1] ===
              words[totalTyped.current - 1] &&
            totalTyped.current <= words.length
          ) {
            correctTyped.current -= 1;
          }

          if (totalTyped.current > 0) {
            setTyped((prev) => prev.slice(0, -1));
            setCursor((prev) => prev - 1);
            totalTyped.current -= 1;
            typedRef.current = typedRef.current.slice(
              0,
              typedRef.current.length - 1
            );
          }

          break;
        default:
          //只有在還沒超過words長度時增加，超過就忽略
          if (totalTyped.current < words.length) {
            setTyped((prev) => prev.concat(key));
            setCursor((prev) => prev + 1);
            totalTyped.current += 1;
            typedRef.current += key;

            //打對字要增加
            if (key === words[totalTyped.current - 1]) {
              correctTyped.current += 1;
            }
          }
      }
    },
    [enabled, words]
  );

  //重設replay儲存、打字紀錄、cursor位置
  const clearTyped = useCallback(() => {
    setTyped('');
    setCursor(0);
    setReplay('');
    typedRef.current = '';
  }, []);

  const resetTotalTyped = useCallback(() => {
    totalTyped.current = 0;
  }, []);

  return {
    typed,
    cursor,
    clearTyped,
    resetTotalTyped,
    totalTyped: totalTyped.current,
    replay,
    keydownHandler,
    correctTyped,
  };
};

export default useMultiTypings;
