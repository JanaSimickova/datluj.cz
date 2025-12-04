import React, { useState, useEffect } from 'react';
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
        }

      }

      active && document.addEventListener('keyup', handleKeyUp)

      return () => {
        active && document.removeEventListener('keyup', handleKeyUp)
      }
  },
    [lettersLeft, onFinish, active, onMistake, shake]
  )

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
    <div className={getWordboxClass(active, mistake, shake)}>{lettersLeft}</div>
  )
}

export default Wordbox;
