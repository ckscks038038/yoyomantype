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

  const keydownHandler = useCallback(
    ({ key, code }) => {
      if (!enabled || !isKeyboardCodeAllowed(code)) {
        return;
      }

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
    [cursor, enabled]
  );

  const clearTyped = useCallback(() => {
    setTyped('');
    setCursor(0);
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
  };
};

export default useTypings;
