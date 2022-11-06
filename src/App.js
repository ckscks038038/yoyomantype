import Replay from './component/replay';
import RestartButton from './component/RestartButton';
import Results from './component/Results';
import UserTypings from './component/UserTypings';
import useEngine from './hooks/useEngine';
import { calculateAccuracyPercentage } from './utils/helper';

const ans = 'abcdefgstop';
const temp = [
  { time: 0, word: 'a' },
  { time: 100, word: 'a' },
  { time: 100, word: 'a' },
  { time: 100, word: 'a' },
  { time: 100, word: 'a' },
  { time: 1000, word: 'x' },
  { time: 500, word: 'x' },
  { time: 500, word: 'x' },
  { time: 1000, word: 'a' },
  { time: 1000, word: 'x' },
  { time: 1000, word: 'a' },
  { time: 1000, word: 'x' },
  { time: 1000, word: '\xa0' },
  { time: 100, word: '\xa0' },
  { time: 200, word: '\xa0' },
  { time: 200, word: '\xa0' },
  { time: 200, word: '\xa0' },
  { time: 200, word: '\xa0' },
  { time: 200, word: '\xa0' },
  { time: 100, word: 'a' },
  { time: 100, word: 'a' },
];
function App() {
  const { state, words, timeLeft, typed, errors, restart, totalTyped } =
    useEngine();

  return (
    <>
      <CountdownTimer timeLeft={timeLeft} />
      <WordsContainer>
        <GeneratedWords words={words} />
        <UserTypings
          className="absolute inset-0"
          userInput={typed}
          words={words}
        />
      </WordsContainer>
      <RestartButton
        className={'mx-auto mt-10 text-slate-500'}
        handleRestart={restart}
      />
      <Results
        state={state}
        className="mt-10"
        errors={errors}
        accuracyPercentage={calculateAccuracyPercentage(errors, totalTyped)}
        total={totalTyped}
      />
      <Replay className="mt-10" state={state} text={temp} ans={ans} />
    </>
  );
}

const GeneratedWords = ({ words }) => {
  return <div className="  text-slate-500">{words}</div>;
};

const CountdownTimer = ({ timeLeft }) => {
  return <h2 className="font-medium text-primary-400">Time: {timeLeft}</h2>;
};

const WordsContainer = ({ children }) => {
  return (
    <div className="relative mt-3 max-w-7xl break-words text-3xl leading-relaxed">
      {children}
    </div>
  );
};

export default App;
