import { useRef } from 'react';
import { VscDebugStart } from 'react-icons/vsc';

const MultiPlayerStartButton = ({ handleStart, className = '' }) => {
  const buttonRef = useRef(null);
  const handleClick = () => {
    buttonRef.current?.blur();
    handleStart();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`block rounded px-8 py-2 hover:bg-slate-700/50 ${className}`}>
      <VscDebugStart className="h-6 w-6" />
    </button>
  );
};

export default MultiPlayerStartButton;
