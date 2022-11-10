import { useParams } from 'react-router-dom';
import useEngine from '../hooks/useEngine';
const Gamepage = ({ className }) => {
  const { id } = useParams();
  const { state, words, timeLeft, typed, errors, restart, totalTyped, replay } =
    useEngine();
  return (
    <>
      <div>Gamepage {id}</div>
      <div>{words}</div>
    </>
  );
};

export default Gamepage;
