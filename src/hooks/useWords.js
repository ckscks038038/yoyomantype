import { faker } from '@faker-js/faker';
import { useCallback, useState } from 'react';

const generateWords = (count) => {
  return faker.random.words(count).toLowerCase();
};

const useWords = (count) => {
  const [words, setWords] = useState(generateWords(count));
  const updateWords = useCallback(() => {
    console.log('here!!! updateWords');
    setWords(generateWords(count));
  }, [count]);

  return { words, updateWords };
};

export default useWords;
