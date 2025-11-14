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

  useEffect(
    () => {
      function handleKeyUp(event: KeyboardEvent) {
        const key = event.key
         
         if (key === 'F5') {
          window.location.reload()
          return
        }

        if (key === lettersLeft[0]) {
          if (lettersLeft.length === 1) {
            onFinish();
          } else {
            setLettersLeft(x => x.slice(1))
            setMistake(false)
          }
        } else {
          setMistake(true)
          onMistake()
        }

      }

      active && document.addEventListener('keyup', handleKeyUp)

      return () => {
        active && document.removeEventListener('keyup', handleKeyUp)
      }
  },
    [lettersLeft, onFinish, active, onMistake]
  )

  const getWordboxClass = (active: boolean, mistake: boolean): string => {
    if (active && mistake) {
      return "wordbox wordbox--active wordbox--mistake"
    }
    if (active) {
      return "wordbox wordbox--active"
    }
    return "wordbox"
  }

  
  return (
    <div className={getWordboxClass(active, mistake)}>{lettersLeft}</div>
  )
}

export default Wordbox;
