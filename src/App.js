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
import logoImg from './image/logo.png';
function App() {
  return (
    <>
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

      <footer className="absolute inset-x-0 bottom-0 mb-12 flex justify-around text-slate-400">
        <div>github</div>
        <div>
          <span>inspired by </span>
          <span className="font-extrabold text-primary-400">monkeytype</span>
        </div>
      </footer>
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
