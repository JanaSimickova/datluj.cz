import { useState } from 'react';
import Stage from './components/Stage';
import GameStart from './components/GameStart';

// přidat postupné zvyšování obtížnosti, upravit zatřesení při každé chybě, na konec hry přidat hlášky typu Neboj, příště to bude lepší, nebo Havně že si alespoň zdravý

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

  const wordSplitter = (word: string) => {
    const letters = word.toUpperCase().split('')
    return (
      letters.map((letter) => (
        <span className="letter">
          {letter}
        </span>
      ))
    )
  }

  return (
    <div className="container">
      <h1 className="title">{wordSplitter("Datlování")}</h1>
      {!isGameStarted ? (
        <GameStart onChange={handleChange} onSubmit={handleSubmit} />
      ) : (
        <Stage playerName={playerName} />
      )}
    </div>
  );
};

export default App;
