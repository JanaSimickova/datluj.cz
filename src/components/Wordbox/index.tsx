import React, { useState, useEffect, useRef } from 'react';
import './style.css';

interface IWordboxProp {
  word: string;
  onFinish: () => void;
  active: boolean;
  onMistake: () => void;
}

const Wordbox : React.FC<IWordboxProp> = ({ word, onFinish, active, onMistake }) => {
  
  const [lettersLeft, setLettersLeft] = useState<string>(word)
  const [mistake, setMistake] = useState<boolean>(false)
  const [shake, setShake] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement>(null!)

  // zkracování slova při správném napsání písmene a přidávání chyb při nesprávném napsání písmene, zatřesení slovem při nesprávném napsání písmene, přehrátí zvuku při nesprávném napsání písmene
  useEffect(
    () => {
      function handleKeyUp(event: KeyboardEvent) {
        const key = event.key
         
        if (key === 'F5') {
          window.location.reload()
          return
        }

        if (key === 'Enter') {
          return
        }

        if (key === lettersLeft[0]) {
          if (lettersLeft.length === 1) {
            onFinish();
          } else {
            setLettersLeft(x => x.slice(1))
            setMistake(false)
            setShake(false)
          }
        } else {
          setMistake(true)
          onMistake()
          setShake(true)
          setTimeout(() => setShake(false), 300)
          audioRef.current.currentTime = 0
          audioRef.current.play()
        }
      }

      active && document.addEventListener('keyup', handleKeyUp)

      return () => {
        active && document.removeEventListener('keyup', handleKeyUp)
      }
  },
    [lettersLeft, onFinish, active, onMistake, shake]
  )

  // funkce pro získání správné třídy pro komponentu Wordbox
  const getWordboxClass = (active: boolean, mistake: boolean, shake: boolean): string => {
    let className = "wordbox"
    if (active) {
      className += " wordbox--active"
    }
    if (mistake) {
      className += " wordbox--mistake"
    }
    if (shake) {
      className += " wordbox--shake"
    }
    return className
  }
  
  return (
    <>
      <audio ref={audioRef} src="/error-mistake-sound.mp3"></audio>
      <div className={getWordboxClass(active, mistake, shake)}>{lettersLeft}</div>
    </>
    
  )
}

export default Wordbox;
