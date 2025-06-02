import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const DifficultyButton = styled(motion.button)`
  padding: 1.5rem 3rem;
  font-size: 1.4rem;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  width: 100%;
  color: #fff;
  background: #2D2D2D;
  border: 1px solid rgba(244, 99, 30, 0.3);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(244, 99, 30, 0.5), transparent);
  }

  &:hover {
    background: #3D3D3D;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4),
                0 0 20px rgba(244, 99, 30, 0.2);
    border-color: rgba(244, 99, 30, 0.5);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
`;

const DifficultyInfo = styled.p`
  margin-top: 0.8rem;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
`;

interface DifficultySelectorProps {
  onSelect: (difficulty: string) => void;
}

const DifficultySelector = ({ onSelect }: DifficultySelectorProps) => {
  const difficulties = [
    { level: 'novice', description: '4-5 letter words' },
    { level: 'intermediate', description: '6-7 letter words' },
    { level: 'hard', description: '8+ letter words' },
  ];

  return (
    <Container>
      {difficulties.map((diff, index) => (
        <motion.div
          key={diff.level}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          <DifficultyButton
            onClick={() => onSelect(diff.level)}
            whileTap={{ scale: 0.95 }}
          >
            {diff.level.charAt(0).toUpperCase() + diff.level.slice(1)}
            <DifficultyInfo>{diff.description}</DifficultyInfo>
          </DifficultyButton>
        </motion.div>
      ))}
    </Container>
  );
};

export default DifficultySelector; 