import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import useMultiEngine from '../hooks/useMultiEngine';
import { GeneratedWords, WordsContainer } from '../utils/helper';
import UserTypings from './UserTypings';
import MultiPlayerStartButton from './MultiPlayerStartButton';
import webSocket from 'socket.io-client';
import ProgressBar from './ProgressBar';
const io = webSocket(`${process.env.REACT_APP_SOCKET_URL}`);

const Gamepage = () => {
  const { id } = useParams();
  let location = useLocation();

  const identity = location?.state?.identity
    ? location.state.identity
    : 'guest';
  const roomId = id;

  const {
    state,
    setState,
    words,
    setWords,
    updateWords,
    typed,
    clearTyped,
    errors,
    restart,
    resetTotalTyped,
    totalTyped,
    replay,
    keydownHandler,
    correctTyped,
    COUNTDOWN_SECONDS,
    timeLeft,
    startCountdown,
    resetCountdown,
  } = useMultiEngine();

  const [users, setUsers] = useState([]);
  const [winner, setWinner] = useState('');

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

      //有人結束遊戲
      io.on('finish state', () => {
        io.gameState = 'finish';
        setState('finish');
        clearTyped();
        resetTotalTyped();
      });

      //渲染贏家為何
      io.on('winner', ({ winnerName, winnerId }) => {
        setWinner(winnerName);
        if (io.id === winnerId) {
          console.log('you win');
          setWinner('YOU!');
        }
      });
    }
  }, [io]);

  const initOwnerSocket = () => {
    io.gameState = 'start';
    io.emit('create room', roomId);
    //儲存文章到roomMap
    io.emit('save article', { roomId, words });

    //房主開始遊戲，如果是finish狀態，要先進到start狀態; 最後廣播給房客當前狀態
    io.on('run state', () => {
      const toBeState = io.gameState === 'finish' ? 'start' : 'run';
      io.gameState = toBeState;
      setState(toBeState);

      //廣播給房客
      io.emit('change guest state', { state: toBeState, roomId: roomId });
      // console.log('房主更新state', toBeState);
    });
  };
  const initGuestSocket = () => {
    io.emit('join room', roomId);
    io.on('get article', (article) => {
      setWords(article);
    });

    io.on('change guest state', (state) => {
      // console.log('房客接受state', state);
      setState(state);
    });

    io.on('startCountdown', () => {
      console.log('startCountdown');
      startCountdown();
    });

    // state在finish時 房主會emit resetCountdown
    io.on('resetCountdown', () => {
      console.log('resetCountdown');
      resetCountdown();
    });
  };

  //在run state下，如果有totaltyped有更新=>傳更新的值(totalTyped)給server
  useEffect(() => {
    if (state === 'run') {
      io.emit('update users progress', {
        roomId,
        totalTyped: correctTyped.current,
      });
    }
  }, [correctTyped.current]);

  // 有人完成就改變狀態成finished
  useEffect(() => {
    if (correctTyped.current === words.length) {
      correctTyped.current = 0;
      io.emit('finish game', { roomId: roomId, id: io.id });
    }
  }, [correctTyped.current]);

  // 在updateWords以後再來儲存articles
  useEffect(() => {
    //如果是owner的話
    if (identity === 'owner') {
      io.emit('save article', { roomId, words });
      io.emit('update article', roomId);
    }
  }, [words]);

  // attach the keydown event listener to record keystrokes
  useEffect(() => {
    window.addEventListener('keydown', keydownHandler);
    // Remove event listeners on cleandup
    return () => {
      window.removeEventListener('keydown', keydownHandler);
    };
  }, [keydownHandler]);
  return (
    <>
      {state !== 'finish' ? (
        <>
          <div className=" mt-80 ">
            <div className="  text-xl  font-bold text-amber-50">
              Room Code: {roomId}
            </div>
            <div className="text-gray-300">You are: {identity}</div>
            <h2 className="text-gray-300">Total length: {words.length}</h2>
          </div>{' '}
          <div className="font-bold text-gray-300">GAME STATE:{state}</div>
          <h2
            className={`mt-2 w-3/6 rounded-xl text-3xl font-extrabold text-red-300`}>
            Count down: {timeLeft}
          </h2>
          <div className="mt-6">
            {users.map((user) => {
              if (io.id === user.id) {
                return (
                  <div
                    className="	text-xl	 font-black text-violet-200"
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
          <WordsContainer>
            <GeneratedWords words={words} />
            <UserTypings
              className="absolute inset-0"
              userInput={typed}
              words={words}
              state={state}
            />
          </WordsContainer>
        </>
      ) : (
        <>
          <div className="mt-80 text-xl text-slate-200 ">{`winner is ${winner}`}</div>
        </>
      )}

      {
        //只有房主擁有開始遊戲權力
        identity === 'owner' && state !== 'run' ? (
          <MultiPlayerStartButton
            className="mt-5 text-slate-500"
            handleStart={
              state === 'start'
                ? () => {
                    io.emit('start game', roomId);
                  }
                : () => {
                    io.emit('get users progress', roomId);
                    updateWords();
                    io.emit('start game', roomId);
                    console.log('按下');
                  }
            }
            countdown={
              state === 'finish'
                ? () => {
                    resetCountdown();
                    io.emit('resetCountdown', roomId);

                    //通知所有人把state設成start//廣播給房客
                    io.emit('change guest state', {
                      state: 'start',
                      roomId: roomId,
                    });
                  }
                : () => {
                    startCountdown();
                    io.emit('startCountdown', roomId);
                  }
            }
            countdownSecond={COUNTDOWN_SECONDS}
            state={state}
          />
        ) : null
      }
    </>
  );
};

export default Gamepage;
