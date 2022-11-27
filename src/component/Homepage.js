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
    restart,
    totalTyped,
    replay,
    COUNTDOWN_SECONDS,
    errorIndex,
  } = useEngine();

  //結束時間可能會比COUNTDOWN_SECONDS更早。利用replay資料裡最後一個字跟第一個字，計算出提早的結束時間為何
  const endTime = (replay[replay.length - 1]?.time - replay[0]?.time) / 1000;

  // console.log('errorindex', Object.keys(errorIndex.current));
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
        <div className="mt-44 ">
          <div className="flex space-x-2">
            <Results
              state={state}
              className="mt-20 mr-20  w-1/6"
              accuracyPercentage={calculateAccuracyPercentage(
                Object.keys(errorIndex.current).length,
                totalTyped
              )}
              total={totalTyped}
              time={Math.min(COUNTDOWN_SECONDS, endTime)}
              errorTyped={Object.keys(errorIndex.current).length}
            />
            <Line
              data={replay}
              timeLength={Math.min(COUNTDOWN_SECONDS, endTime)}
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
