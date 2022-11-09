import { BsKeyboard } from 'react-icons/bs';

const KeyboardButton = ({ className }) => {
  return (
    <button
      className={`block rounded px-8 py-2 hover:bg-slate-700/50 ${className} `}>
      <BsKeyboard className="h-6 w-6"></BsKeyboard>
    </button>
  );
};

export default KeyboardButton;
