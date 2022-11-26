import { useRef, useState } from 'react';
import { VscDebugStart } from 'react-icons/vsc';

const MultiPlayerStartButton = ({
  handleStart,
  className = '',
  countdown,
  countdownSecond,
  state,
}) => {
  const buttonRef = useRef(null);
  const [displayButton, setDisplayButton] = useState(1);
  const handleClick = () => {
    buttonRef.current?.blur();

    if (state === 'finish') {
      handleStart();
      setDisplayButton(1);
    } else {
      setTimeout(handleStart, countdownSecond * 1000);
      setDisplayButton(0);
    }

    countdown();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`block rounded px-8 py-2 hover:bg-slate-700/50 ${className} ${
        displayButton ? null : 'hidden'
      }`}>
      <VscDebugStart className="h-6 w-6" />
    </button>
  );
};

export default MultiPlayerStartButton;
