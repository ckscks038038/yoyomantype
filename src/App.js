import MultiPlayerButton from './component/MultiPlayerButton';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MultiplayerPage from './component/MultiplayerPage';
import Homepage from './component/Homepage';
import KeyboardButton from './component/KeyboardButton';
import Gamepage from './component/Gamepage';

function App() {
  return (
    <>
      <nav className="mb-8 flex">
        <Link to="/">
          <KeyboardButton className={'mx-auto mt-10 text-slate-500'} />
        </Link>
        <Link to="/multiplayer">
          <MultiPlayerButton className={'mx-auto mt-10 text-slate-500'} />
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/multiplayer" element={<MultiplayerPage />} />
        <Route path="/multiplayer/:id" element={<Gamepage />} />
      </Routes>
    </>
  );
}

export default App;
