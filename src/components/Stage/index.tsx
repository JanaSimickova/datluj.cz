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

  // proměnné pro nastavení základních pravidel hry
  const gameDuration: number = 60
  const wordLength: number = 6
  const maxMistakes: number = 5

  // přidat životy srdíčka místo chyb, přidat postupné zvyšování obtížnosti, upravit zatřesení při každé chybě, na konec hry přidat hlášky typu Neboj, příště to bude lepší, nebo Havně že si alespoň zdravý

  // všechny stavy pro tuto komponentu
  const [words, setWords] = useState<string[]>(initializeWords(3, 6));
  const [mistakes, setMistakes] = useState<number>(0);
  const [playerData, setPlayerData] = useState<PlayerDataStructure>({
    playerName: playerName,
    score: 0,
    date: '',
  });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [time, setTime] = useState<number>(gameDuration);
  const [hasSavedScore, setHasSavedScore] = useState<boolean>(false);
  
  // funkce pro vygenerování nového slova po napsání celého správného slova, přidání počítání skóre
  const handleFinish = () => {
    const newWord = generateWord(wordLength);
    setWords([...words.slice(1), newWord]);
    setPlayerData((playerData) => ({
      ...playerData,
      score: playerData.score + 1,
    }));
  };

  // funkce pro počítání chyb při napsání nesprávného písmena
  const handleMistake = () => {
    setMistakes((oldMistakes) => oldMistakes + 1);
  };

  // načtení dat z localStorage pro zobrazení v tabulce nejlepších výsledků
  let scores: HighestScores = [];
  const storedString = localStorage.getItem('highestScores');
  if (storedString) {
    try {
      scores = JSON.parse(storedString);
    } catch (e) {
      scores = [];
    }
  }

  // uložení skóre po dokončení hry
  useEffect(() => {
    if (!(mistakes >= maxMistakes || gameOver)) return;
    if (hasSavedScore) return;

    const stored = localStorage.getItem('highestScores');
    let current: HighestScores = [];
    if (stored) {
      try {
        current = JSON.parse(stored);
      } catch (e) {
        current = [];
      }
    }

    const date = new Date();
    const formatedDate = date.toLocaleString('cs-CZ');

    const updated = [
      ...current,
      { playerName: playerData.playerName, score: playerData.score, date: formatedDate },
    ];

    try {
      localStorage.setItem('highestScores', JSON.stringify(updated));
      setHasSavedScore(true);
    } catch (e) {
      console.warn('Failed to save score', e);
    }
  }, [mistakes, gameOver, hasSavedScore, playerData.playerName, playerData.score]);
  
  // nastavení časovače pro celou hru
  useEffect(() => {
    if (gameOver) return
    const gameTimeout = setTimeout(() => setGameOver(true), gameDuration * 1000)
    console.log('game MOUNT')
    return () => clearTimeout(gameTimeout)
  }, [gameOver, gameDuration])

  // nastavení intervalu pro odečítání času v průběhu hry
  useEffect(() => {
    if (gameOver) return;
    const timeChangeInterval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000)
    console.log('time MOUNT')
    return () => clearInterval(timeChangeInterval)
  }, [gameOver])

  // funkce, která se spustí po kliknutí na tlačítko Hrát znovu
  const playAgain = () => {
    setMistakes(0)
    setPlayerData((playerData) => ({
      ...playerData,
      score: 0,
    }))
    setGameOver(false)
    setTime(gameDuration)
    setHasSavedScore(false)
  }

  // funkce pro nastavení třídy elementu s odpočtem času
  const setTimerClassName = (seconds: number) => {
    if(seconds <= 30 && seconds > 10) {
      return "stage__timer stage__timer--time-low"
    } else if (seconds <= 10) {
      return "stage__timer stage__timer--time-danger"
    } else {
      return "stage__timer"
    }
  }

  // dvě funkce pro získání správného formátu minut a sekund pro obsah elementu s odpočtem času
  const getMinutesFormated = (time: number) => {
    return (time >= 60 ? Math.floor(time / 60) : 0).toString().padStart(2, '0')
  }
  const getSecondsFormated = (time: number) => {
    return (time % 60).toString().padStart(2, '0')
  }

  // funkce pro získání správného formátu slova bod do závěrečného vyhodnocení
  const getScoreFormated = (score: number) => {
    if(score === 1) {
      return `${score} bod`
    } else if (score >= 2 && score <= 4) {
      return `${score} body`
    } else {
      return `${score} bodů`
    }
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
