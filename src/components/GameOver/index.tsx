import './style.css'
import type { HighestScores } from '../Stage';

interface GameOverProps {
  playerName: string;
  score: number;
  allScores: HighestScores;
  handleClick: () => void;
  message: string;
}

export const GameOver = ({ playerName, score, allScores, handleClick, message }: GameOverProps) => {
  
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

  return (
    <div className="gameover">
      <h2 className="gameover__title">Hra skončila!</h2>
      <p className="gameover__result">
        Výsledek hráče {playerName}: <strong>{getScoreFormated(score)}</strong>
      </p>
      <p className="gameover__message">{message}</p>
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

