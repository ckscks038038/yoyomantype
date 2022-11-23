import { IoIosPeople } from 'react-icons/io';

const MultiPlayerButton = ({ className }) => {
  return (
    <button
      className={`block rounded px-8 py-2 hover:bg-slate-700/50 ${className} `}>
      <IoIosPeople className="h-10 w-10"></IoIosPeople>
    </button>
  );
};

export default MultiPlayerButton;
