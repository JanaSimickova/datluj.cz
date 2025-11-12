import './style.css'

interface GameStartProps {
  onStart: () => void;
}

const GameStart = ({onStart}: GameStartProps) => {
  return (
    <div className="welcome-screen">
          <p className="welcome-text">Vítejte v aplikaci pro nácvik psaní všemi deseti!</p>
          <button className="start-button" onClick={onStart}>
            Start
          </button>
        </div>
  )
}

export default GameStart
