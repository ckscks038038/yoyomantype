import './App.css';
import { faker } from '@faker-js/faker';
import RestartButton from './component/RestartButton';
import Results from './component/Results';
import UserTypings from './component/UserTypings';
const words = faker.random.words(20);
function App() {
  return (
    <>
      <CountdownTimer timeLeft={30} />
      <WordsContainer>
        <GeneratedWords words={words} />
        <UserTypings className="absolute inset-0" userInput={'123123123'} />
      </WordsContainer>
      <RestartButton
        className={'mx-auto mt-10 text-slate-500'}
        handleRestart={() => null}
      />
      <Results
        className="mt-10"
        errors={10}
        accuracyPercentage={100}
        total={200}
      />
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
