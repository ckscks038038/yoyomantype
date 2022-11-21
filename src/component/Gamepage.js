import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import useMultiEngine from '../hooks/useMultiEngine';
import { GeneratedWords, WordsContainer } from '../utils/helper';
import UserTypings from './UserTypings';
import MultiPlayerStartButton from './MultiPlayerStartButton';
import webSocket from 'socket.io-client';
// const io = webSocket('http://localhost:3300');
const io = webSocket('http://localhost:3000');
const Gamepage = () => {
  const { id } = useParams();
  let location = useLocation();
  const identity = location.state.identity;
  const roomId = location.state.roomId;
  const {
    state,
    setState,
    words,
    setWords,
    updateWords,
    timeLeft,
    typed,
    clearTyped,
    errors,
    restart,
    resetTotalTyped,
    totalTyped,
    replay,
  } = useMultiEngine();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (io) {
      if (identity === 'owner') {
        initOwnerSocket();
      } else {
        initGuestSocket();
      }

      //剛進遊戲，發送請求取得所有人名字、打字進度(遊戲開始時，大家都是typed=0)
      io.emit('get users progress', roomId);

      //更新所有玩家打字進度畫面
      io.on('send users progress', (usersProgress) => {
        const arrOfUsersId = Object.keys(usersProgress.users);
        const arrOfUsersProgress = arrOfUsersId.map((id) => {
          return {
            name: usersProgress.users[id].name,
            typed: usersProgress.users[id].typed,
            id: id,
          };
        });
        setUsers(arrOfUsersProgress);
      });

      //房主開始遊戲
      io.on('run state', () => {
        setState('run');
      });

      //有人結束遊戲
      io.on('finish state', () => {
        setState('finish');
        clearTyped();
        resetTotalTyped();
      });
    }
  }, [io]);

  const initOwnerSocket = () => {
    io.emit('create room', roomId);
    //儲存文章到roomMap
    io.emit('save article', { roomId, words });
  };
  const initGuestSocket = () => {
    io.emit('join room', roomId);
    io.on('get article', (article) => {
      setWords(article);
    });
  };

  //在run state下，如果有totaltyped有更新=>傳更新的值(totalTyped)給server
  useEffect(() => {
    if (state === 'run') {
      io.emit('update users progress', { roomId, totalTyped });
    }
  }, [totalTyped]);

  // 有人完成就改變狀態成finished
  useEffect(() => {
    if (totalTyped === words.length) {
      io.emit('finish game', roomId);
    }
  }, [totalTyped]);

  // 在updateWords以後再來儲存articles
  useEffect(() => {
    //如果是owner的話
    if (identity === 'owner') {
      io.emit('save article', { roomId, words });
      io.emit('update article', roomId);
    }
  }, [words]);

  return (
    <>
      <div className="mt-80 text-xl font-bold text-amber-50">
        Room Code: {id}
      </div>
      <div className="text-gray-300">You are: {identity}</div>
      <h2 className="text-gray-300">Total length: {words.length}</h2>
      <div className="font-bold text-gray-300">GAME STATE:{state}</div>
      <div className="mt-6">
        {users.map((user) => {
          if (io.id === user.id) {
            return (
              <div
                className="text-xl	font-black	 text-violet-200"
                key={`${user.name}_${user.typed}`}>
                <h2> {user.name}(you)</h2>
                <ProgressBar
                  progressPercentage={(user.typed / words.length) * 100}
                />
              </div>
            );
          } else {
            return (
              <div
                className=" text-xl font-black	text-zinc-400"
                key={`${user.name}_${user.typed} `}>
                <h2> {user.name}</h2>
                {/* <h2>typed: {user.typed}</h2> */}
                <ProgressBar
                  progressPercentage={(user.typed / words.length) * 100}
                />
              </div>
            );
          }
        })}
      </div>
      {state !== 'finish' ? (
        <WordsContainer>
          <GeneratedWords words={words} />
          <UserTypings
            className="absolute inset-0"
            userInput={typed}
            words={words}
            state={state}
          />
        </WordsContainer>
      ) : (
        <div className="mt-20 text-xl text-slate-200 ">Next Run Let's Go</div>
      )}

      {
        //只有房主擁有開始遊戲權力
        identity === 'owner' && (state === 'start' || state === 'finish') ? (
          <MultiPlayerStartButton
            className="mt-5 text-slate-500"
            handleStart={
              state === 'start'
                ? () => {
                    io.emit('start game', roomId);
                  }
                : () => {
                    updateWords();
                    io.emit('start game', roomId);
                  }
            }
          />
        ) : null
      }
    </>
  );
};

const ProgressBar = ({ progressPercentage }) => {
  return (
    <div className="h-2 w-6/12 rounded-2xl	 bg-gray-300">
      <div
        style={{ width: `${progressPercentage}%` }}
        className={`h-full ${
          progressPercentage < 70 ? 'bg-red-600' : 'bg-green-600'
        }`}></div>
    </div>
  );
};

export default Gamepage;
