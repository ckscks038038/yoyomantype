import { BsFillPersonFill } from 'react-icons/bs';

const AccountButton = ({ className }) => {
  return (
    <button
      className={`block rounded px-8 py-2 hover:bg-slate-700/50 ${className} `}>
      <BsFillPersonFill className="h-10 w-10"></BsFillPersonFill>
    </button>
  );
};

export default AccountButton;
