import Replay from './Replay';
import RestartButton from './RestartButton';
import Results from './Results';
import UserTypings from './UserTypings';
import useEngine from '../hooks/useEngine';
import { calculateAccuracyPercentage } from '../utils/helper';

function Homepage() {
  const { state, words, timeLeft, typed, errors, restart, totalTyped, replay } =
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
          state={state}
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

      <div className=" text-slate-500">Replay</div>
      <Replay className="mt-10" state={state} ans={words} replay={replay} />
    </>
  );
}

const GeneratedWords = ({ words }) => {
  return <div className=" text-slate-500">{words}</div>;
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

export default Homepage;
