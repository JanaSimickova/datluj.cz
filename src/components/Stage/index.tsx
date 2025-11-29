import { useState, useEffect } from 'react';
import Wordbox from '../Wordbox';
import wordList from '../../word-list';
import './style.css';

// TODO: temporary disable function - remove next line when you start using it
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const generateWord = (size: number) => {
  const sizeIndex =
    size === undefined ? Math.floor(Math.random() * wordList.length) : size - 3;

  if (sizeIndex < 0 || sizeIndex >= wordList.length) {
    return '';
  }

  const words = wordList[sizeIndex];
  const wordIndex = Math.floor(Math.random() * words.length);
  return words[wordIndex];
};

export interface StageProps {
  playerName: string;
}

export interface PlayerDataStructure {
  playerName: string;
  score: number;
  date: string;
}

type HighestScores = PlayerDataStructure[];

const Stage = ({ playerName }: StageProps) => {
  const initializeWords = (count: number, length: number): string[] => {
    return Array.from({ length: count }, () => generateWord(length));
  };

  const gameDuration: number = 10
  const wordLength: number = 6
  const maxMistakes: number = 5

  // opravit chybu, aby to každou sekundu nenačítalo nové skóre
  // přidat komentáře, přidat životy srdíčka místo chyb, přidat postupné zvyšování obtížnosti, upravit zatřesení při každé chybě, na konec hry přidat hlášky typu Neboj, příště to bude lepší, nebo Havně že si alespoň zdravý

  const [words, setWords] = useState<string[]>(initializeWords(3, 6));
  const [mistakes, setMistakes] = useState<number>(0);
  const [playerData, setPlayerData] = useState<PlayerDataStructure>({
    playerName: playerName,
    score: 0,
    date: '',
  });
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [time, setTime] = useState<number>(gameDuration)
  
  useEffect(
    () => {
      const gameTimer = setInterval(
        () => {
          setGameOver(true)
        }, gameDuration * 1000
      )

      return () => {
        clearInterval(gameTimer)
      }
    }, [gameOver])

  useEffect(
    () => {
      const timeChangeTimer = setInterval(
        () => {
          setTime(time => time -1)
          setTimerClassName(time)
        }, 1000
      )

      return () => {
        clearInterval(timeChangeTimer)
      }
    }, [time])
  

  const handleFinish = () => {
    const newWord = generateWord(wordLength);
    setWords([...words.slice(1), newWord]);
    setPlayerData((playerData) => ({
      ...playerData,
      score: playerData.score + 1,
    }));
  };

  const handleMistake = () => {
    setMistakes((oldMistakes) => oldMistakes + 1);
  };

  let scores: HighestScores = [];
  const storedString = localStorage.getItem('highestScores');
  if (storedString) {
    scores = JSON.parse(storedString);
  }

  if (mistakes >= maxMistakes || gameOver) {
    const date = new Date();
    const formatedDate = date.toLocaleString('cs-CZ');
    scores = [
      ...scores,
      {
        playerName: playerData.playerName,
        score: playerData.score,
        date: formatedDate,
      },
    ];
    const jsonString = JSON.stringify(scores);

    localStorage.setItem('highestScores', jsonString);
  }

  const getScoreFormated = (score: number) => {
    if(score === 1) {
      return `${score} bod`
    } else if (score >= 2 && score <= 4) {
      return `${score} body`
    } else {
      return `${score} bodů`
    }
  }

  const playAgain = () => {
    setMistakes(0)
    setPlayerData((playerData) => ({
      ...playerData,
      score: 0,
    }))
    setGameOver(false)
    setTime(60)
  }

  const setTimerClassName = (seconds: number) => {
    if(seconds <= 30 && seconds > 10) {
      return "stage__timer stage__timer--time-low"
    } else if (seconds <= 10) {
      return "stage__timer stage__timer--time-danger"
    } else {
      return "stage__timer"
    }
  }

  const getMinutesFormated = (time: number) => {
    return (time >= 60 ? Math.floor(time / 60) : 0).toString().padStart(2, '0')
  }

  const getSecondsFormated = (time: number) => {
    return (time % 60).toString().padStart(2, '0')
  }

  return (
    <div className="stage">
      {(mistakes < maxMistakes && !gameOver) && (
        <div>
          <div className="stage__header">
            <div className="stage__mistakes">Chyb: {mistakes}</div>
            <div className="stage__score">Skóre: {playerData.score}</div>
          </div>
          <div className={setTimerClassName(time)}>Zbývající čas {getMinutesFormated(time)}:{getSecondsFormated(time)}</div>
          <div className="stage__words">
            {words.map((word) => (
              <Wordbox
                word={word}
                key={word}
                onFinish={handleFinish}
                active={word === words[0]}
                onMistake={handleMistake}
              />
            ))}
          </div>
        </div>
      )}
      {(mistakes >= maxMistakes || gameOver) && (
        <div className="stage__game-over">
          <h2 className="gameover__title">Hra skončila!</h2>
          <p className="gameover__result">
            Výsledek hráče {playerData.playerName}: <strong>{getScoreFormated(playerData.score)}</strong>
          </p>
          <h2 className="gameover__table-title">Tabulka nejlepších výsledků</h2>
          <table className="stage__leaderboard">
            <thead>
              <tr>
                <th>#</th>
                <th>Jméno</th>
                <th>Skóre</th>
                <th>Datum</th>
              </tr>
            </thead>
            <tbody>
              {scores
                .sort((a, b) => b.score - a.score)
                .slice(0, 10)
                .map((entry, index) => (
                  <tr key={index}>
                    <td className="rank">{index + 1}</td>
                    <td>{entry.playerName}</td>
                    <td className="score">{entry.score}</td>
                    <td>{entry.date}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button className="play-again-button" onClick={playAgain}>Hrát znovu</button>
        </div>
      )}
    </div>
  );
};

export default Stage;
