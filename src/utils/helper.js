import axios from 'axios';

// 建立後端API連線
const apiAdress = process.env.REACT_APP_API_URL;
const apiClient = axios.create({
  baseURL: apiAdress,
  timeout: 30000,
});

// helper function
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

export const consecutiveRanges = (a) => {
  let length = 1;
  let list = [];

  // If the array is empty,
  // return the list
  if (a.length == 0) {
    return list;
  }

  // Traverse the array from first position
  for (let i = 1; i <= a.length; i++) {
    // Check the difference between the
    // current and the previous elements
    // If the difference doesn't equal to 1
    // just increment the length variable.
    if (i == a.length || a[i] - a[i - 1] != 1) {
      // If the range contains
      // only one element.
      // add it into the list.
      if (length !== 1) {
        // Build the range between the first
        // element of the range and the
        // current previous element as the
        // last range.
        list.push({ start: a[i - length], end: a[i - 1] });
      }

      // After finding the first range
      // initialize the length by 1 to
      // build the next range.
      length = 1;
    } else {
      length++;
    }
  }

  return list;
};

// outer component
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

// API
export const InsertGameRecord = async ({ acc, cpm }) => {
  if (localStorage.getItem('jwtToken')) {
    const token = localStorage.getItem('jwtToken');
    let headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };
    try {
      return await apiClient.post('record', { acc, cpm }, { headers: headers });
    } catch (err) {
      return { error: true, err };
    }
  } else {
    console.log('guest can not insert record into DB');
  }
};

export const FuzzySearch = async ({ word }) => {
  try {
    const res = await apiClient.post('fuzzysearch', { word });
    return res.data;
  } catch (err) {
    return { error: true, err };
  }
};

export const QueryString = async ({ word }) => {
  try {
    const res = await apiClient.post('querystring', { word });
    return res.data;
  } catch (err) {
    return { error: true, err };
  }
};
