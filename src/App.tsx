import { useState } from 'react';
import Stage from './components/Stage';
import GameStart from './components/GameStart';

const App: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsGameStarted(true)
  }

  return (
    <div className="container">
      <h1 className="title">Datlování</h1>
      {!isGameStarted ? (
        <GameStart onChange={handleChange} onSubmit={handleSubmit} />
      ) : (
        <Stage playerName={playerName} />
      )}
    </div>
  );
};

export default App;
