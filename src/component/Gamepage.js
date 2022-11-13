import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import useEngine from '../hooks/useEngine';
import webSocket from 'socket.io-client';
const io = webSocket('http://localhost:3300');

const Gamepage = () => {
  const { id } = useParams();
  let location = useLocation();
  const identity = location.state.identity;
  const roomId = location.state.roomId;
  const {
    state,
    words,
    setWords,
    timeLeft,
    typed,
    errors,
    restart,
    totalTyped,
    replay,
  } = useEngine();
  useEffect(() => {
    if (io) {
      if (identity === 'owner') {
        initOwnerSocket();
      } else {
        initGuestSocket();
      }
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

  return (
    <>
      <div>{identity}</div>
      <div>Gamepage {id}</div>
      <div>{words}</div>
    </>
  );
};

export default Gamepage;
