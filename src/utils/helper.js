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
