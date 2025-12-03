import './style.css'

interface GameStartProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const GameStart = ({onSubmit, onChange}: GameStartProps) => {

  return (
    <div className="welcome-screen">
      <p className="welcome-text">Nauč se psát všemi deseti!</p>
      <p className="welcome-rules">Napiš co nejvíce slov správně za jednu minutu.</p>
      <p className="welcome-rules">Máš ovšem jen 5 životů - můžeš udělat jen 5 chyb.</p>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">
          Zadej své jméno:
          <input type="text" id="name" name="name" onChange={onChange} required autoFocus />
        </label>
        <button type="submit" className="start-button">Start</button>
      </form>
    </div>
  )
}

export default GameStart
