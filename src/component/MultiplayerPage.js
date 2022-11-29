import { useState, useEffect } from 'react';
import { TiChevronRight } from 'react-icons/ti';
import { SiGamejolt } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import webSocket from 'socket.io-client';
import { BsPeople } from 'react-icons/bs';
import { TiGroup } from 'react-icons/ti';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { v4: uuidv4 } = require('uuid');
const io = webSocket(`${process.env.REACT_APP_SOCKET_URL}`);

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
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          toastId: "Room doesn't exist.",
        });
        console.log('room does not exist');
      }
    });

    setinputValue('');
  };

  return (
    <>
      <div className="grid justify-items-center">
        <h1 className="p- mb-10 mt-56 rounded-xl	bg-primary-500 px-7 text-3xl font-black text-slate-800">
          MULTIPLAYER MODE
        </h1>

        <SiGamejolt className=" mb-10  h-52 w-52   text-primary-400" />
        <div className="grid justify-items-center space-y-5">
          <input
            type="button"
            className="rounded-md border-2 bg-slate-100 px-2 font-semibold"
            value="create room"
            onClick={createRoom}
          />
          <div className="font-bold text-slate-400">or</div>
          <div className="ml-8 flex space-x-1">
            <input
              placeholder="enter room code"
              className="w-52 rounded-md bg-slate-200 px-3 placeholder-gray-500"
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
        </div>
      </div>

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

export default MultiplayerPage;
