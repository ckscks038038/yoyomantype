import axios from 'axios';

export const formatPercentage = (percentage) => {
  return percentage.toFixed(0) + '%';
};

export const calculateAccuracyPercentage = (errors, total) => {
  if (total > 0) {
    const corrects = total - errors;
    return (corrects / total) * 100;
  }

  return 0;
};

export const countErrors = (actual, expected) => {
  const expectedCharacters = expected.split('');

  return expectedCharacters.reduce((errors, expectedChar, i) => {
    const actualChar = actual[i];
    if (actualChar !== expectedChar) {
      errors++;
    }
    return errors;
  }, 0);
};

export const checkRoomId = (roomId) => {
  const fetchData = async () => {
    const res = await axios.post(
      'http://localhost:3300/api/1.0/multiplayer/room',
      {
        roomId: roomId,
      }
    );
    return res.data.wordsArr;
  };
  fetchData();
};

export const WordsContainer = ({ children }) => {
  return (
    <div className="relative mt-3 max-w-7xl break-words text-3xl leading-relaxed">
      {children}
    </div>
  );
};

export const GeneratedWords = ({ words }) => {
  return <div className=" text-slate-500">{words}</div>;
};

export const CountdownTimer = ({ timeLeft }) => {
  return <h2 className="text-3xl font-medium text-primary-400"> {timeLeft}</h2>;
};
