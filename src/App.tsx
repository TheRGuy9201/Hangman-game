import React from 'react'
import { useState } from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import HangmanGame from './components/HangmanGame'
import DifficultySelector from './components/DifficultySelector'
import './App.css'

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #1E1E1E;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30vh;
    background: linear-gradient(180deg, rgba(48, 152, 152, 0.05) 0%, transparent 100%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30vh;
    background: linear-gradient(0deg, rgba(203, 4, 4, 0.05) 0%, transparent 100%);
    pointer-events: none;
  }
`

const Title = styled(motion.h1)`
  font-size: 4rem;
  margin-bottom: 2rem;
  color: #FF9F00;
  text-shadow: 0 0 10px rgba(255, 159, 0, 0.3),
               0 0 20px rgba(255, 159, 0, 0.2),
               0 0 30px rgba(255, 159, 0, 0.1);
  position: relative;
  z-index: 1;
  letter-spacing: 2px;
  
  @media (max-width: 600px) {
    font-size: 2.5rem;
  }
`

const GameWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
  background: rgba(30, 30, 30, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
`

function App() {
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const handleDifficultySelect = (level: string) => {
    setDifficulty(level);
    setGameStarted(true);
  };

  const handleGameReset = () => {
    setGameStarted(false);
    setDifficulty(null);
  };

  return (
    <AppContainer>
      <Title
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Hangman Challenge
      </Title>
      
      <GameWrapper>
        {!gameStarted ? (
          <DifficultySelector onSelect={handleDifficultySelect} />
        ) : (
          <HangmanGame difficulty={difficulty!} onReset={handleGameReset} />
        )}
      </GameWrapper>
    </AppContainer>
  );
}

export default App;