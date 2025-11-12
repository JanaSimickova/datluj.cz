import { useState } from 'react';
import Stage from './components/Stage';
import GameStart from './components/GameStart';

const App: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  const handleStartGame = () => {
    setIsGameStarted(true);
  };

  return (
    <div className="container">
      <h1>Datlování</h1>
      {!isGameStarted ? (
        <GameStart onStart={handleStartGame} />
      ) : (
        <Stage />
      )}
    </div>
  );
};

export default App;
