import { faker } from '@faker-js/faker';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const generateWords = (count) => {
  return faker.random.words(count).toLowerCase();
};

const asyncGetwords = (count) => {
  const fetchData = async () => {
    const res = await axios.post('http://localhost:3300/api/1.0/words', {
      wordsNum: count,
    });
    // console.log(res.data.wordsArr);
    const wordStr = '';
    res.data.wordsArr.forEach((word) => {
      wordStr += word + ' ';
    });
    // console.log('dataStr', res.data.wordsStr);
    // setWords(res.data);
    return res.data.wordsArr;
  };
  fetchData();
};

const useWords = (count) => {
  const [words, setWords] = useState(generateWords(count));

  const updateWords = useCallback(() => {
    console.log('here!!! updateWords');
    setWords(generateWords(count));
  }, [count]);

  return { words, updateWords, setWords };
};

export default useWords;

//測試自己寫的資料打axios
// useEffect(() => {
//   const fetchData = async () => {
//     const res = await axios.post('http://localhost:3300/api/1.0/words', {
//       wordsNum: count,
//     });
//     // console.log(res.data.wordsArr);
//     let wordStr = '';
//     res.data.wordsArr.forEach((word) => {
//       wordStr += word + ' ';
//     });

//     // setWords(res.data);
//     return res.data.wordsArr;
//   };
//   fetchData();
// }, []);
