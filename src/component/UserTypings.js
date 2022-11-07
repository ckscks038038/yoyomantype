import cn from 'classnames';
import Caret from './Caret';

const UserTypings = ({ userInput, className, words, state }) => {
  const typedCharacters = userInput.split('');

  return (
    <div className={className}>
      {typedCharacters.map((char, index) => (
        <Character
          key={`${char}_${index}`}
          actual={char}
          expected={words[index]}
        />
      ))}

      {state !== 'finish' ? (
        <Caret className={'inline-block h-7 w-0.5 bg-primary-500'} />
      ) : null}
    </div>
  );
};

const Character = ({ actual, expected }) => {
  const isCorrect = actual === expected;
  const isWhiteSpace = expected === ' ';
  return (
    <span
      className={cn({
        'text-red-500': !isCorrect && !isWhiteSpace,
        'text-primary-400': isCorrect && !isWhiteSpace,
        'bg-red-500/50': !isCorrect && isWhiteSpace,
      })}>
      {expected}
    </span>
  );
};

export default UserTypings;
