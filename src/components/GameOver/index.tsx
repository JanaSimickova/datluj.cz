import './style.css'
import { useState, useEffect } from 'react';
import type { HighestScores } from '../Stage';
import { lowScoreMessages, highScoreMessages } from '../../utils/messages';

interface GameOverProps {
  playerName: string;
  score: number;
  allScores: HighestScores;
  handleClick: () => void;
}

export const GameOver = ({ playerName, score, allScores, handleClick}: GameOverProps) => {
  
  // stav pro finální hlášku
  const [finalMessage, setFinalMessage] = useState<string>("")

  // useEffect pro nastavení finální hlášky
  useEffect(() => {
    if(finalMessage === "") {
      const message = handleMessage(score)
      setFinalMessage(message)
    }
  }, [finalMessage, score])

  // funkce pro výběr hlášky podle dosaženého skóre
  const handleMessage = (score: number) => {
    if (score < 10) {
      return lowScoreMessages[Math.floor(Math.random()*lowScoreMessages.length)]
    } else {
      return highScoreMessages[Math.floor(Math.random()*highScoreMessages.length)]
    }
  }

  // funkce pro získání správného formátu slova bod do závěrečného vyhodnocení
  const getScoreFormated = (score: number) => {
    if (score === 1) {
      return `${score} bod`;
    } else if (score >= 2 && score <= 4) {
      return `${score} body`;
    } else {
      return `${score} bodů`;
    }
  };

  // funkce pro získání stylu hlášky
  const getMessageClassName = (score: number) => {
    if (score < 10) {
      return "gameover__message gameover__message--low-score"
    } else {
      return "gameover__message gameover__message--high-score"
    }
  }
  
  return (
    <div className="gameover">
      <h2 className="gameover__title">Hra skončila!</h2>
      <p className="gameover__result">
        Výsledek hráče <strong>{playerName}</strong>: <strong>{getScoreFormated(score)}</strong>
      </p>
      <p className={getMessageClassName(score)}>{finalMessage}</p>
      <h2 className="gameover__table-title">Tabulka nejlepších výsledků</h2>
      <table className="gameover__leaderboard">
        <thead>
          <tr>
            <th>#</th>
            <th>Jméno</th>
            <th>Skóre</th>
            <th>Datum</th>
          </tr>
        </thead>
        <tbody>
          {allScores
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
      <button className="play-again-button" onClick={handleClick}>
        Hrát znovu
      </button>
    </div>
  );
};

