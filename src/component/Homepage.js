import Replay from './Replay';
import RestartButton from './RestartButton';
import Results from './Results';
import UserTypings from './UserTypings';
import useEngine from '../hooks/useEngine';
import LineChart from './LineChart';
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
        <div>
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
        <div>
          <div className="text-transparent">
            1321232132321323213232132321323213232132321323213232132321323213232132321323213232132321323213232132321323213232132321323213
          </div>
          <div>
            <Line data={replay} timeLength={COUNTDOWN_SECONDS} />
          </div>
          <Results
            state={state}
            className="mt-10"
            errors={errors}
            accuracyPercentage={calculateAccuracyPercentage(errors, totalTyped)}
            total={totalTyped}
          />

          <div className=" text-slate-500">Replay</div>
          <Replay className="mt-10" state={state} ans={words} replay={replay} />
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
