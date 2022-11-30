import { IoWarning } from 'react-icons/io5';

const WarningIcon = ({ isCapsLockOn }) => {
  return (
    <>
      <div className={isCapsLockOn ? 'visible' : 'invisible'}>
        <IoWarning />
        <p>{`${isCapsLockOn}ohohoh`}</p>
      </div>
    </>
  );
};

export default WarningIcon;
