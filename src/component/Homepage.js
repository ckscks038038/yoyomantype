import Replay from './Replay';
import RestartButton from './RestartButton';
import Results from './Results';
import UserTypings from './UserTypings';
import useEngine from '../hooks/useEngine';
import {
  calculateAccuracyPercentage,
  WordsContainer,
  GeneratedWords,
  CountdownTimer,
} from '../utils/helper';

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

export default Homepage;
