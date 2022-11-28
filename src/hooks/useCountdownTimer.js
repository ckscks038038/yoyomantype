import { useCallback, useEffect, useRef, useState } from 'react';

const useCountdownTimer = (seconds) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const intervalRef = useRef(null);

  const startCountdown = useCallback(() => {
    // console.log('starting countdown...');

    intervalRef.current = setInterval(() => {
      setTimeLeft((timeLeft) => timeLeft - 1);
    }, 1000);
  }, [setTimeLeft]);

  const resetCountdown = useCallback(() => {
    // console.log('resetting countdown...');

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setTimeLeft(seconds);
  }, [seconds]);

  // when the countdown reaches 0, clear the countdown interval
  useEffect(() => {
    if (!timeLeft && intervalRef.current) {
      // console.log('clearing timer...');

      clearInterval(intervalRef.current);
    }
  }, [timeLeft, intervalRef]);

  return { timeLeft, startCountdown, resetCountdown };
};

export default useCountdownTimer;
