import { useState, useEffect } from 'react';
import webSocket from 'socket.io-client';
import { TiChevronRight } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';
const { v4: uuidv4 } = require('uuid');
const io = webSocket('http://localhost:3300');

const MultiplayerPage = () => {
  const [inputValue, setinputValue] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    if (io) {
      //連線成功在 console 中打印訊息
      console.log('success connect!');
      //設定監聽
      initWebSocket();
    }
  }, [io]);
  const initWebSocket = () => {
    //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
    io.on('getMessage', (message) => {
      console.log('server來的', message);
    });
  };

  // 使用者可以創建房間(房主)、加入房間(房客)
  const sendMessage = () => {
    //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
    io.emit('getMessage', '安安');
  };

  //創建房間
  const createRoom = () => {
    // 創建roomID，並且紀錄在roomMap
    const roomId = uuidv4().slice(0, 6);

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
        navigate(`/multiplayer/${roomId}`, {
          state: { identity: 'guest', roomId: roomId },
        });
      } else {
        console.log('room does not exist');
      }
    });

    setinputValue('');
  };

  return (
    <WordsContainer>
      <input type="button" value="目前有的房間" onClick={sendMessage} />
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
          className="h-6 w-6 rounded-md border-2 border-gray-800"
        />
      </div>
    </WordsContainer>
  );
};

const WordsContainer = ({ children }) => {
  return <div className=" text-1xl flex  space-x-4 ">{children}</div>;
};
export default MultiplayerPage;
