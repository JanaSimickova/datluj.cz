import './style.css'

interface GameStartProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const GameStart = ({onSubmit, onChange}: GameStartProps) => {

  return (
    <div className="welcome-screen">
      <p className="welcome-text">Vítejte v aplikaci pro nácvik psaní všemi deseti!</p>
      <p className="welcome__rules">Pokus se napsat co nejvíce slov, dokud neuděláš 5 chyb.</p>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">
          Zadej své jméno:
          <input type="text" id="name" name="name" onChange={onChange} />
        </label>
        <button type="submit" className="start-button">Start</button>
      </form>
    </div>
  )
}

export default GameStart
