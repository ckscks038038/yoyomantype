import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import useMultiEngine from '../hooks/useMultiEngine';

import { GeneratedWords, WordsContainer } from '../utils/helper';
import UserTypings from './UserTypings';
import MultiPlayerStartButton from './MultiPlayerStartButton';
import webSocket from 'socket.io-client';
const io = webSocket('http://localhost:3300');

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
      <h2>Total length: {words.length}</h2>
      <div>
        {users.map((user) => {
          return (
            <div key={`${user.name}_${user.typed}`}>
              <h2>name: {user.name}</h2>
              <h2>typed: {user.typed}</h2>

              <hr />
            </div>
          );
        })}
      </div>
      <div>{identity}</div>
      <div>{totalTyped}</div>
      <div>Gamepage {id}</div>
      <div>{state}</div>
      <WordsContainer>
        <GeneratedWords words={words} />
        <UserTypings
          className="absolute inset-0"
          userInput={typed}
          words={words}
          state={state}
        />
      </WordsContainer>

      {
        //只有房主擁有開始遊戲權力
        identity === 'owner' && (state === 'start' || state === 'finish') ? (
          <MultiPlayerStartButton
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

export default Gamepage;
