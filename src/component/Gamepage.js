import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import useMultiEngine from '../hooks/useMultiEngine';

import { GeneratedWords, WordsContainer } from '../utils/helper';
import UserTypings from './UserTypings';
import webSocket from 'socket.io-client';
import MultiPlayerStartButton from './MultiPlayerStartButton';
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

  useEffect(() => {
    if (io) {
      if (identity === 'owner') {
        initOwnerSocket();
      } else {
        initGuestSocket();
      }

      //初始化所有socket io設定
      io.emit('get users name', roomId);

      //修改所有人的state
      io.on('run state', () => {
        setState('run');
      });

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
      console.log('重新取得文章', article);
      setWords(article);
    });
  };

  useEffect(() => {
    if (totalTyped === words.length) {
      alert('I finish the game!');
      io.emit('finish game', roomId);
    }
  }, [totalTyped]);

  //在updateWords以後再來儲存articles
  useEffect(() => {
    //如果是owner的話
    if (identity === 'owner') {
      io.emit('save article', { roomId, words });
      io.emit('update article', roomId);
    }
  }, [words]);

  return (
    <>
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
                    console.log('重開始');
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
