import React from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const DrawingContainer = styled.div`
  width: 100%;
  max-width: 400px;
  height: 400px;
  position: relative;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-right: 2rem;

  @media (max-width: 1200px) {
    margin-right: 0;
    height: 350px;
    max-width: 350px;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    height: 300px;
    max-width: 300px;
    padding: 1rem;
    margin: 0 auto;
  }
`;

const SVGContainer = styled(motion.svg)`
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 10px rgba(48, 152, 152, 0.2));

  @media (max-width: 480px) {
    filter: drop-shadow(0 0 5px rgba(48, 152, 152, 0.2));
  }
`;

const EmotionBubble = styled(motion.div)`
  position: absolute;
  left: 290px;
  top: 70px;
  transform: translateY(-50%);
  background: #2D2D2D;
  padding: 1rem;
  border-radius: 20px;
  font-size: 1.2rem;
  color: #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  min-width: 120px;
  text-align: center;
  border: 1px solid rgba(244, 99, 30, 0.3);
  z-index: 10;
  
  &::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    border-style: solid;
    border-width: 10px;
    border-color: transparent #2D2D2D transparent transparent;
  }

  @media (max-width: 1200px) {
    left: auto;
    right: -20px;
    top: 70px;
    transform: none;
    font-size: 1.1rem;
    min-width: 110px;
    
    &::before {
      left: -20px;
      top: 50%;
      transform: translateY(-50%);
      border-color: transparent #2D2D2D transparent transparent;
    }
  }

  @media (max-width: 480px) {
    right: -10px;
    top: 60px;
    padding: 0.7rem;
    min-width: 90px;
    font-size: 1rem;
    
    &::before {
      border-width: 8px;
      left: -16px;
    }
  }
`;

interface HangmanDrawingProps {
  wrongGuesses: number;
  isWinning?: boolean;
}

const HangmanDrawing = ({ wrongGuesses, isWinning = false }: HangmanDrawingProps) => {
  const parts = [
    // Base
    {
      d: "M20 290 L280 290",
      strokeWidth: 4,
    },
    // Vertical pole
    {
      d: "M60 290 L60 10",
      strokeWidth: 4,
    },
    // Horizontal beam
    {
      d: "M60 10 L200 10",
      strokeWidth: 4,
    },
    // Rope
    {
      d: "M200 10 L200 50",
      strokeWidth: 4,
    },
    // Head
    {
      type: "circle",
      cx: 200,
      cy: 80,
      r: 30,
      fill: "none",
      strokeWidth: 4,
    },
    // Body
    {
      d: "M200 110 L200 200",
      strokeWidth: 4,
    },
    // Left arm
    {
      d: "M200 140 L160 180",
      strokeWidth: 4,
    },
    // Right arm
    {
      d: "M200 140 L240 180",
      strokeWidth: 4,
    },
    // Left leg
    {
      d: "M200 200 L160 260",
      strokeWidth: 4,
    },
    // Right leg
    {
      d: "M200 200 L240 260",
      strokeWidth: 4,
    },
  ];

  const drawingVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  // Update colors in the drawing
  const strokeColor = "#309898";
  const fillColor = "none";
  const strokeWidth = 3;

  // Get emotion based on game state
  const getEmotion = () => {
    if (isWinning) return "🎉 Yay!";
    if (wrongGuesses === 0) return "😊 Let's play!";
    if (wrongGuesses === 1) return "🤔 Hmm...";
    if (wrongGuesses === 2) return "😅 Oops!";
    if (wrongGuesses === 3) return "😰 Oh no!";
    if (wrongGuesses === 4) return "😨 Help!";
    if (wrongGuesses === 5) return "😱 Please!";
    return "💀 Game Over!";
  };

  // Get face expression paths based on game state
  const getFaceFeatures = () => {
    const eyeSize = wrongGuesses >= 4 ? 4 : 3;
    const eyeY = 75;
    const leftEyeX = 190;
    const rightEyeX = 210;

    // Eye animations based on state
    const eyeVariants = {
      normal: { y: 0 },
      worried: { y: -2 },
      scared: { y: -4 },
    };

    const eyeState = wrongGuesses <= 2 ? "normal" : wrongGuesses <= 4 ? "worried" : "scared";

    // Mouth path based on state
    let mouthPath = "";
    if (isWinning) {
      mouthPath = "M185 90 Q200 105 215 90"; // Big smile
    } else if (wrongGuesses <= 2) {
      mouthPath = "M185 90 Q200 100 215 90"; // Slight smile
    } else if (wrongGuesses <= 4) {
      mouthPath = "M185 90 L215 90"; // Straight line
    } else {
      mouthPath = "M185 95 Q200 85 215 95"; // Frown
    }

    return (
      <>
        <motion.circle
          cx={leftEyeX}
          cy={eyeY}
          r={eyeSize}
          fill="#4ecca3"
          initial="normal"
          animate={eyeState}
          variants={eyeVariants}
          transition={{ duration: 0.3 }}
        />
        <motion.circle
          cx={rightEyeX}
          cy={eyeY}
          r={eyeSize}
          fill="#4ecca3"
          initial="normal"
          animate={eyeState}
          variants={eyeVariants}
          transition={{ duration: 0.3 }}
        />
        <motion.path
          d={mouthPath}
          stroke="#4ecca3"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
        />
      </>
    );
  };

  return (
    <DrawingContainer>
      <SVGContainer
        viewBox="0 0 300 300"
        initial="hidden"
        animate="visible"
      >
        {parts.slice(0, wrongGuesses + 4).map((part, index) => {
          if ('type' in part && part.type === 'circle') {
            return (
              <motion.circle
                key={index}
                cx={part.cx}
                cy={part.cy}
                r={part.r}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill={fillColor}
                variants={drawingVariants}
                custom={index}
                style={{
                  filter: 'drop-shadow(0 0 2px rgba(48, 152, 152, 0.5))'
                }}
              />
            );
          }
          return (
            <motion.path
              key={index}
              d={part.d}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="none"
              variants={drawingVariants}
              custom={index}
              style={{
                filter: 'drop-shadow(0 0 2px rgba(48, 152, 152, 0.5))'
              }}
            />
          );
        })}

        {/* Face features - only show when head is drawn */}
        {wrongGuesses >= 1 && getFaceFeatures()}
      </SVGContainer>

      <AnimatePresence>
        <EmotionBubble
          initial={{ scale: 0, opacity: 0, x: -50 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ scale: 0, opacity: 0, x: -50 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        >
          {getEmotion()}
        </EmotionBubble>
      </AnimatePresence>
    </DrawingContainer>
  );
};

export default HangmanDrawing; 