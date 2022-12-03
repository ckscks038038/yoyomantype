import cn from 'classnames';
import { useState, useEffect, useRef } from 'react';

import Caret from './Caret';
import ReplayButton from './ReplayButton';

const Replay = ({ state, ans, replay }) => {
  const replayLength = replay.length;

  const [currentWord, setCurrentWord] = useState('');
  const index = useRef(0);
  // console.log(replay);
  const time = useRef(0);
  const base = useRef(0);
  const baseMilisecondTime = 500;
  //播放測試
  const [playing, setPlaying] = useState(0);
  const hasPlayed = useRef(0);
  const [showButton, setShowButton] = useState(1);
  const play = () => {
    hasPlayed.current = 1;
    playing ? setPlaying(0) : setPlaying(1);
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      //寫判斷：Backspace, space要如何處理？
      if (state === 'finish' && playing) {
        // 修正time interval
        const c = replay[index.current] ? replay[index.current].time : 0;

        if (index.current === 0) {
          base.current = c;
          // console.log(base.current);
          time.current = baseMilisecondTime;
        } else {
          time.current = c;
          time.current = (time.current - base.current) % 10000;

          base.current = c;
        }

        const word = replay[index.current] ? replay[index.current].word : '';

        if (word === 'Backspace') {
          setCurrentWord((prev) => {
            return prev.slice(0, -1);
          });
        } else {
          setCurrentWord((prev) => {
            return prev + word;
          });
        }

        index.current += 1;
        if (replayLength === index.current) {
          setShowButton(0);
        }

        // 首次進入遊戲、重新遊戲 => 清空原本紀錄
      } else if (state === 'start') {
        index.current = 0;
        base.current = 0;
        setCurrentWord('');
      }
    }, time.current);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentWord, replay, state, playing, replayLength]);

  const typedCharacters = currentWord.split('');

  if (state !== 'finish') {
    return null;
  } else {
    return (
      <>
        <div className="flex  space-x-0.5">
          <div className="  text-slate-500">Replay</div>
          {showButton ? (
            <ReplayButton
              showButton={showButton}
              isPlaying={playing}
              replayHandler={play}
            />
          ) : null}
        </div>

        <div className={'  w-1/2 break-all'}>
          {typedCharacters.map((char, index) => {
            return (
              <Character
                key={`${char}_${index}`}
                actual={char}
                expected={ans[index]}
              />
            );
          })}
          {hasPlayed.current ? (
            <Caret className={'inline-block h-4 w-0.5 bg-primary-500'} />
          ) : null}
        </div>
      </>
    );
  }
};

const Character = ({ actual, expected }) => {
  const isCorrect = actual === expected;
  const isWhiteSpace = expected === ' ';

  return (
    <span
      className={cn({
        'text-red-500': !isCorrect && !isWhiteSpace,
        'text-primary-400': isCorrect && !isWhiteSpace,
        'bg-red-500/50': !isCorrect && isWhiteSpace,
      })}>
      {expected}
    </span>
  );
};
export default Replay;
