import { useState } from 'react';
import Wordbox from '../Wordbox';
import wordList from '../../word-list';
import './style.css';

// TODO: temporary disable function - remove next line when you start using it
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const generateWord = (size: number) => {
  const sizeIndex = size === undefined
    ? Math.floor(Math.random() * wordList.length)
    : size - 3
  
  if (sizeIndex < 0 || sizeIndex >= wordList.length) {
    return ""
  }
  
  const words = wordList[sizeIndex];
  const wordIndex = Math.floor(Math.random() * words.length)
  return words[wordIndex]
}

const Stage = () => {
  
  const initializeWords = (count: number, length: number): string[] => {
    return Array.from({ length: count }, () => generateWord(length))
  }

  const [words, setWords] = useState<string[]>(initializeWords(3, 6))
  const [mistakes, setMistakes] = useState<number>(0)
  const [score, setScore] = useState<number>(0)

  const handleFinish = () => {
    const newWord = generateWord(6)
    setWords([...words.slice(1), newWord])
    setScore(oldScore => oldScore + 1)
  }

  const handleMistake = () => {
    setMistakes(oldMistakes => oldMistakes + 1)
  }

  return (
    <div className="stage">
      <div className="stage__header">
        <div className="stage__mistakes">Chyb: {mistakes}</div>
        <div className="stage__score">Skóre: {score}</div>
      </div>
      <div className="stage__words">
        {words.map((word) => 
        <Wordbox 
          word={word} 
          key={word} 
          onFinish={handleFinish} 
          active={word === words[0]}
          onMistake={handleMistake}
          />)}
      </div>
    </div>
  )
}

export default Stage;
