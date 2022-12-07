import MultiPlayerButton from './component/MultiPlayerButton';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import MultiplayerPage from './component/MultiplayerPage';
import Homepage from './component/Homepage';
import KeyboardButton from './component/KeyboardButton';
import Gamepage from './component/Gamepage';
import Account from './component/Account';
import AccountButton from './component/AccountButton';
import Profile from './component/Profile';
import LogOutButton from './component/LogoutButton';
import logoImg from './image/logo.png';
function App() {
  return (
    <>
      <div>
        <nav className=" absolute left-72 top-10 flex">
          <Link to="/">
            <img alt="logo" src={logoImg} width="350" className="mt-10 mr-10" />
          </Link>
          <Link to="/">
            <KeyboardButton className={'mx-auto mt-10 text-slate-500'} />
          </Link>
          <Link to="/multiplayer">
            <MultiPlayerButton className={'mx-auto mt-10 text-slate-500'} />
          </Link>
          <Link to="/account">
            <AccountButton className={'mx-auto mt-10 text-slate-500'} />
          </Link>
          <Link className=" top-0 h-16 w-16">
            <LogOutButton className={'mx-auto mt-10 text-slate-500'} />
          </Link>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/multiplayer" element={<MultiplayerPage />} />
        <Route path="/multiplayer/:id" element={<Gamepage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
