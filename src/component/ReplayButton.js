import { BsFillPlayFill, BsPauseFill } from 'react-icons/bs';

const ReplayButton = ({ isPlaying, replayHandler }) => {
  return (
    <>
      <button onClick={replayHandler}>
        {isPlaying ? (
          <BsPauseFill className="text-slate-400" />
        ) : (
          <BsFillPlayFill className="text-slate-400" />
        )}
      </button>
    </>
  );
};

export default ReplayButton;
