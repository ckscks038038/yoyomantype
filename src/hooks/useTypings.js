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

const useTypings = (enabled) => {
  const [cursor, setCursor] = useState(0);
  const [typed, setTyped] = useState('');
  const totalTyped = useRef(0);
  const [replay, setReplay] = useState([]);
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
          setTyped((prev) => prev.slice(0, -1));
          setCursor((prev) => prev - 1);
          totalTyped.current -= 1;
          break;
        default:
          setTyped((prev) => prev.concat(key));
          setCursor((prev) => prev + 1);
          totalTyped.current += 1;
      }
    },
    [enabled]
  );

  //重設replay儲存、打字紀錄、cursor位置
  const clearTyped = useCallback(() => {
    //檢查replay現在存放什麼
    console.log('replay', replay);
    setTyped('');
    setCursor(0);
    setReplay('');
  }, []);

  const resetTotalTyped = useCallback(() => {
    totalTyped.current = 0;
  }, []);

  // attach the keydown event listener to record keystrokes
  useEffect(() => {
    window.addEventListener('keydown', keydownHandler);
    //Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', keydownHandler);
    };
  }, [keydownHandler]);

  return {
    typed,
    cursor,
    clearTyped,
    resetTotalTyped,
    totalTyped: totalTyped.current,
    replay,
  };
};

export default useTypings;
