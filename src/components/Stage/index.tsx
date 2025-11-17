import { useState } from 'react';
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
  scoreDate: string;
}

type HighestScores = PlayerDataStructure[];

const Stage = ({ playerName }: StageProps) => {
  const initializeWords = (count: number, length: number): string[] => {
    return Array.from({ length: count }, () => generateWord(length));
  };

  const [words, setWords] = useState<string[]>(initializeWords(3, 6));
  const [mistakes, setMistakes] = useState<number>(0);
  const [playerData, setPlayerData] = useState<PlayerDataStructure>({
    playerName: playerName,
    score: 0,
    scoreDate: '',
  });

  const handleFinish = () => {
    const newWord = generateWord(6);
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

  if (mistakes >= 5) {
    const date = new Date();
    const formatedDate = date.toLocaleString('cs-CZ');
    scores = [
      ...scores,
      {
        playerName: playerData.playerName,
        score: playerData.score,
        scoreDate: formatedDate,
      },
    ];
    const jsonString = JSON.stringify(scores);

    localStorage.setItem('highestScores', jsonString);
  }

  return (
    <div className="stage">
      {mistakes < 5 && (
        <div>
          <div className="stage__header">
            <div className="stage__mistakes">Chyb: {mistakes}</div>
            <div className="stage__score">Skóre: {playerData.score}</div>
          </div>
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
      {mistakes >= 5 && (
        <div className="stage__game-over">
          <h2 className="gameover__title">Hra skončila!</h2>
          <p className="gameover__result">
            Výsledek hráče {playerData.playerName}: {playerData.score} bodů
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
                    <td>{entry.scoreDate}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Stage;
