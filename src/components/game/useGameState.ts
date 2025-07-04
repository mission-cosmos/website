
import { useState, useRef, useCallback } from "react";
import { GAME_CONSTANTS } from "./gameUtils";

export interface GameObject {
  x: number;
  y: number;
}

export interface Rover extends GameObject {
  w: number;
  h: number;
  speed: number;
}

export const useGameState = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [waterPoints, setWaterPoints] = useState(0);
  const [signalStrength, setSignalStrength] = useState(100);

  const frame = useRef(0);
  const rover = useRef<Rover>({ 
    x: 40, 
    y: GAME_CONSTANTS.HEIGHT - 75, 
    w: GAME_CONSTANTS.ROVER_WIDTH, 
    h: GAME_CONSTANTS.ROVER_HEIGHT, 
    speed: GAME_CONSTANTS.ROVER_SPEED 
  });
  const iceChunks = useRef<GameObject[]>([]);
  const dusts = useRef<GameObject[]>([]);
  const rocks = useRef<GameObject[]>([]);

  const endGame = useCallback(() => {
    setGameOver(true);
  }, []);

  const spawnIce = useCallback(() => {
    iceChunks.current.push({ 
      x: Math.random() * (GAME_CONSTANTS.WIDTH - GAME_CONSTANTS.ICE_SIZE), 
      y: -GAME_CONSTANTS.ICE_SIZE 
    });
  }, []);

  const spawnDust = useCallback(() => {
    dusts.current.push({ 
      x: Math.random() * (GAME_CONSTANTS.WIDTH - GAME_CONSTANTS.DUST_SIZE), 
      y: -GAME_CONSTANTS.DUST_SIZE 
    });
  }, []);

  const spawnRock = useCallback(() => {
    rocks.current.push({ 
      x: Math.random() * (GAME_CONSTANTS.WIDTH - GAME_CONSTANTS.ROCK_WIDTH), 
      y: -GAME_CONSTANTS.ROCK_HEIGHT 
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setWaterPoints(0);
    setSignalStrength(100);
    setScore(0);
    frame.current = 0;
    rover.current = { 
      x: 40, 
      y: GAME_CONSTANTS.HEIGHT - 75, 
      w: GAME_CONSTANTS.ROVER_WIDTH, 
      h: GAME_CONSTANTS.ROVER_HEIGHT, 
      speed: GAME_CONSTANTS.ROVER_SPEED 
    };
    iceChunks.current = [];
    dusts.current = [];
    rocks.current = [];
  }, []);

  return {
    gameStarted,
    gameOver,
    score,
    waterPoints,
    signalStrength,
    frame,
    rover,
    iceChunks,
    dusts,
    rocks,
    setScore,
    setWaterPoints,
    setSignalStrength,
    endGame,
    spawnIce,
    spawnDust,
    spawnRock,
    resetGame
  };
};
