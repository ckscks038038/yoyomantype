import MultiPlayerButton from './component/MultiPlayerButton';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MultiplayerPage from './component/MultiplayerPage';
import Homepage from './component/Homepage';
import KeyboardButton from './component/KeyboardButton';

import Gamepage from './component/Gamepage';
import Account from './component/Account';
import AccountButton from './component/AccountButton';
import Profile from './component/Profile';
import LogOutButton from './component/LogoutButton';
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
        <Link to="/account">
          <AccountButton className={'mx-auto mt-10 text-slate-500'} />
        </Link>
        <Link className="absolute top-0 right-5 h-16 w-16">
          <LogOutButton className={'mx-auto mt-10 text-slate-500'} />
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/test" element={<h1>註冊登入</h1>} />
        <Route path="/multiplayer" element={<MultiplayerPage />} />
        <Route path="/multiplayer/:id" element={<Gamepage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
