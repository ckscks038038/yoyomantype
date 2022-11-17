import { useState, useEffect } from 'react';
import { TiChevronRight } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';
import webSocket from 'socket.io-client';
import { BsPeople } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const notify = () => toast('Wow so easy!');
const { v4: uuidv4 } = require('uuid');
const io = webSocket('http://localhost:3000');
// const io = webSocket();
const MultiplayerPage = () => {
  const [inputValue, setinputValue] = useState('');
  const navigate = useNavigate();

  // 使用者可以創建房間(房主)、加入房間(房客)

  //創建房間
  const createRoom = () => {
    // 創建roomID，並且紀錄在roomMap
    const roomId = uuidv4().slice(0, 6);

    //跳轉畫面前換頁

    navigate(`/multiplayer/${roomId}`, {
      state: { identity: 'owner', roomId: roomId },
    });
  };

  //加入房間
  const checkRoom = () => {
    const roomId = inputValue;
    io.emit('check room', roomId);

    io.on('join auth', ({ auth }) => {
      // auth success
      if (auth) {
        //跳轉畫面前換頁

        navigate(`/multiplayer/${roomId}`, {
          state: { identity: 'guest', roomId: roomId },
        });
      } else {
        toast.error('🦄 Room Code does not exist!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        console.log('room does not exist');
      }
    });

    setinputValue('');
  };

  return (
    <>
      <BsPeople className="mb-10 h-60 w-60  text-gray-100"></BsPeople>
      <h1 className="mb-10 text-6xl font-black text-gray-100	">
        Multiplayer MODE
      </h1>
      <WordsContainer>
        <input
          type="button"
          className="rounded-md border-2 bg-slate-100 px-2"
          value="create room"
          onClick={createRoom}
        />

        <div className="flex space-x-1">
          <input
            placeholder="enter room code"
            className="w-48 rounded-md bg-slate-400 pl-3 placeholder-gray-500"
            value={inputValue}
            onChange={(event) => {
              setinputValue(event.target.value);
            }}
          />
          <TiChevronRight
            type="button"
            onClick={checkRoom}
            className="h-6 w-6 rounded-md border-2 border-gray-800 text-slate-400"
          />
        </div>
      </WordsContainer>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

const WordsContainer = ({ children }) => {
  return <div className=" text-1xl flex  space-x-4 ">{children}</div>;
};
export default MultiplayerPage;
