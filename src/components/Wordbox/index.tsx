import React, { useState, useEffect } from 'react';
import './style.css';

interface IWordboxProp {
  word: string;
  onFinish: () => void;
}

const Wordbox : React.FC<IWordboxProp> = ({ word, onFinish }) => {
  const [lettersLeft, setLettersLeft] = useState<string>(word);  
  const [mistake, setMistake] = useState<boolean>(false);

  useEffect(
    () => {
      function handleKeyUp(event: KeyboardEvent) {
        const key = event.key
         
        if (key === lettersLeft[0]) {
          if (lettersLeft.length === 1) {
            onFinish();
          } else {
            setLettersLeft(x => x.slice(1))
            setMistake(false)
          }
        } else {
          setMistake(true)
        }

    }

      document.addEventListener('keyup', handleKeyUp);

      return () => {
        document.removeEventListener('keyup', handleKeyUp); 
      }
  },
    [lettersLeft]
  );

  
  return (
    <div className={mistake ? "wordbox wordbox--mistake" : "wordbox"}>{lettersLeft}</div>
  );
};

export default Wordbox;
