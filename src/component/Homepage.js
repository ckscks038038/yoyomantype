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
import Line from '../line';

function Homepage() {
  const {
    state,
    words,
    timeLeft,
    typed,
    errors,
    restart,
    totalTyped,
    replay,
    COUNTDOWN_SECONDS,
  } = useEngine();

  return (
    <>
      {state !== 'finish' ? (
        <div className="mt-80">
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
        </div>
      ) : (
        <div className="mt-44">
          <div className="flex space-x-2">
            <Results
              state={state}
              className="mt-20 mr-20  w-1/6"
              errors={errors}
              accuracyPercentage={calculateAccuracyPercentage(
                errors,
                totalTyped
              )}
              total={totalTyped}
            />
            <Line
              data={replay}
              timeLength={COUNTDOWN_SECONDS}
              className="w-5/6"
            />
          </div>

          <div className="ml-32">
            <div className=" mt-20 text-slate-500">Replay</div>
            <Replay state={state} ans={words} replay={replay} />
          </div>
        </div>
      )}
      <RestartButton
        className={'mx-auto mt-10 text-slate-500'}
        handleRestart={restart}
      />
    </>
  );
}

export default Homepage;
