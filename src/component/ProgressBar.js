import { FaCarSide } from 'react-icons/fa';

const ProgressBar = ({ progressPercentage }) => {
  return (
    <div className="h-2 w-6/12 rounded-2xl	 bg-gray-300">
      <div
        style={{
          width: `${progressPercentage}%`,
          textAlign: 'right',
          borderRadius: 'inherit',
        }}
        className={`h-full blur-sm ${
          progressPercentage < 20
            ? 'bg-primary-100 '
            : progressPercentage < 40
            ? 'bg-primary-200'
            : progressPercentage < 60
            ? 'bg-primary-300'
            : progressPercentage < 80
            ? 'bg-primary-400'
            : progressPercentage < 90
            ? 'bg-red-500'
            : 'bg-red-600 '
        }`}>
        <span>*</span>
      </div>
    </div>
  );
};

export default ProgressBar;
