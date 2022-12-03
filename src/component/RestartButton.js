import { useRef } from 'react';

const RestartButton = ({ handleRestart }) => {
  const buttonRef = useRef(null);
  const handleClick = () => {
    buttonRef.current?.blur();
    handleRestart();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`block rounded-xl border-4 border-slate-800 bg-slate-900 px-8 py-2 font-semibold hover:bg-primary-500 `}>
      One More Round
    </button>
  );
};

export default RestartButton;
