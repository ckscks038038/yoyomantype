import Caret from './Caret';

const UserTypings = ({ userInput, className }) => {
  console.log(userInput);
  const typedCharacters = userInput.split('');
  return (
    <div className={className}>
      {typedCharacters.map((char, index) => {
        return <Character key={`${char}_${index}`} char={char} />;
      })}
      <Caret />
    </div>
  );
};

const Character = ({ char }) => {
  return <span className="text-primary-400">{char}</span>;
};

export default UserTypings;
