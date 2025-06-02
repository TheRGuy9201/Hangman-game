import React from 'react';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import HangmanDrawing from './HangmanDrawing';

const GameContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(350px, 1fr) minmax(450px, 1fr);
  gap: 3rem;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  padding: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const GameControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  padding-left: 2rem;

  @media (max-width: 1200px) {
    padding-left: 0;
    gap: 1rem;
  }
`;

const Word = styled.div`
  display: flex;
  gap: 0.8rem;
  margin: 2rem 0;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 0.4rem;
    margin: 1rem 0;
  }
`;

const Letter = styled(motion.span)<{ isRevealed?: boolean }>`
  font-size: 3rem;
  font-weight: bold;
  border-bottom: 4px solid ${props => props.isRevealed ? '#CB0404' : '#FF9F00'};
  width: 50px;
  text-align: center;
  text-transform: uppercase;
  color: ${props => props.isRevealed ? '#CB0404' : '#fff'};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: 480px) {
    font-size: 2rem;
    width: 35px;
    border-bottom-width: 3px;
  }
`;

const Keyboard = styled.div`
  display: grid;
  grid-template-rows: repeat(4, auto);
  gap: 0.8rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;

  @media (max-width: 480px) {
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .keyboard-row {
    display: flex;
    justify-content: center;
    gap: 0.8rem;
    margin: 0.3rem 0;

    @media (max-width: 480px) {
      gap: 0.4rem;
      margin: 0.2rem 0;
    }
  }

  .keyboard-row:last-child {
    padding: 0 4rem;

    @media (max-width: 480px) {
      padding: 0 2rem;
    }
  }
`;

const KeyboardButton = styled(motion.button)<{ isUsed?: boolean }>`
  padding: 0.8rem;
  font-size: 1.3rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.isUsed ? '#309898' : '#F4631E'};
  color: white;
  cursor: ${props => props.isUsed ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.isUsed ? 0.5 : 1};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 45px;
  min-height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${props => props.isUsed ? '#309898' : '#FF9F00'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const ResetButton = styled(motion.button)`
  padding: 1.2rem 2.5rem;
  font-size: 1.4rem;
  border: none;
  border-radius: 12px;
  background: #CB0404;
  color: white;
  cursor: pointer;
  margin-top: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  align-self: center;

  &:hover {
    background: #e60404;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const Message = styled(motion.div)`
  font-size: 2rem;
  color: #FF9F00;
  text-align: center;
  margin: 1.5rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  font-weight: bold;
  
  .word-reveal {
    display: block;
    font-size: 1.5rem;
    color: #CB0404;
    margin-top: 0.5rem;
    text-transform: uppercase;
  }
`;

interface HangmanGameProps {
  difficulty: string;
  onReset: () => void;
}

// const getWordForDifficulty = (difficulty: string): string => {
//   // This is a small sample. In a real app, you'd want a much larger word list
//   const words = {
//     novice: ['cat', 'dog', 'run', 'jump', 'play'],
//     intermediate: ['python', 'coding', 'gaming', 'puzzle'],
//     hard: ['challenge', 'developer', 'javascript', 'programming']
//   };
  
//   const wordList = words[difficulty as keyof typeof words];
//   return wordList[Math.floor(Math.random() * wordList.length)];
// };

const HangmanGame = ({ difficulty, onReset }: HangmanGameProps) => {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  useEffect(() => {
  fetch('/20k.txt')
    .then(res => res.text())
    .then(text => {
      const commonWords = new Set([
        "the", "a", "an", "in", "on", "at", "to", "from", "by", "for",
        "of", "and", "or", "but", "if", "than", "so", "yet", "with",
        "about", "as", "into", "like", "through", "after", "over",
        "under", "between", "out", "against", "during", "without",
        "before", "around", "near", "since", "until", "upon"
      ]);

      const allWords = text
        .split('\n')
        .map(w => w.trim().toLowerCase())
        .filter(w =>
          w.length >= 3 &&
          w.length <= 20 &&
          /^[a-z]+$/.test(w) &&
          !commonWords.has(w)
        );

      let filteredWords: string[] = [];

      switch (difficulty) {
        case 'novice':
          filteredWords = allWords.filter(w => w.length >= 3 && w.length <= 4);
          break;
        case 'intermediate':
          filteredWords = allWords.filter(w => w.length >= 5 && w.length <= 7);
          break;
        case 'hard':
          filteredWords = allWords.filter(w => w.length >= 8);
          break;
        default:
          filteredWords = allWords;
      }

      const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
      setWord(randomWord || 'fallback'); // fallback if list empty
    })
    .catch(err => {
      console.error('Failed to load word list:', err);
      setWord('fallback'); // fallback if fetch fails
    });
}, [difficulty]);


  const handleGuess = (letter: string) => {
    if (gameStatus !== 'playing') return;

    const newGuessedLetters = new Set(guessedLetters);
    newGuessedLetters.add(letter);
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      setWrongGuesses(prev => prev + 1);
      if (wrongGuesses + 1 >= 6) {
        setGameStatus('lost');
      }
    } else {
      const allLettersGuessed = [...word].every(l => newGuessedLetters.has(l));
      if (allLettersGuessed) {
        setGameStatus('won');
      }
    }
  };

  // Split keyboard into rows
  const keyboardRows = [
    'abcdefg'.split(''),
    'hijklmn'.split(''),
    'opqrstu'.split(''),
    'vwxyz'.split('')
  ];

  return (
    <GameContainer>
      <HangmanDrawing 
        wrongGuesses={wrongGuesses} 
        isWinning={gameStatus === 'won'} 
      />
      
      <GameControls>
        <Word>
          {word.split('').map((letter, index) => (
            <Letter
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                scale: gameStatus === 'lost' && !guessedLetters.has(letter) ? [1, 1.2, 1] : 1
              }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.5
              }}
              isRevealed={gameStatus === 'lost' && !guessedLetters.has(letter)}
            >
              {(guessedLetters.has(letter) || gameStatus === 'lost') ? letter : '_'}
            </Letter>
          ))}
        </Word>

        <AnimatePresence>
          {gameStatus !== 'playing' && (
            <Message
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {gameStatus === 'won' ? '🎉 Congratulations! You won! 🎉' : (
                <>
                  😔 Game Over!
                  <span className="word-reveal">The word was: {word.toUpperCase()}</span>
                </>
              )}
            </Message>
          )}
        </AnimatePresence>

        <Keyboard>
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="keyboard-row">
              {row.map(letter => (
                <KeyboardButton
                  key={letter}
                  onClick={() => handleGuess(letter)}
                  isUsed={guessedLetters.has(letter)}
                  whileHover={!guessedLetters.has(letter) ? { scale: 1.1 } : undefined}
                  whileTap={!guessedLetters.has(letter) ? { scale: 0.95 } : undefined}
                  disabled={guessedLetters.has(letter) || gameStatus !== 'playing'}
                >
                  {letter}
                </KeyboardButton>
              ))}
            </div>
          ))}
        </Keyboard>

        <ResetButton
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          New Game
        </ResetButton>
      </GameControls>
    </GameContainer>
  );
};

export default HangmanGame; 