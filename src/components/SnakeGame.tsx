import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Ghost, Zap } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 80;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef(direction);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Keep ref in sync to prevent rapid double-key self-collision
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsStarted(true);
    setIsPaused(false);
    gameAreaRef.current?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isStarted || gameOver) return;

      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'Escape') {
        setIsPaused(p => !p);
        return;
      }

      if (isPaused) return;

      const { x, y } = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarted, gameOver, isPaused]);

  useEffect(() => {
    if (!isStarted || gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [isStarted, gameOver, isPaused, food, score, generateFood]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] px-4">
        <div className="text-xl font-bold neon-text-cyan">SCORE: {score}</div>
        <div className="text-xl font-bold neon-text-magenta">
          {gameOver ? 'GAME OVER' : isPaused ? 'PAUSED' : 'PLAYING'}
        </div>
      </div>

      <div 
        ref={gameAreaRef}
        className="relative bg-gray-900/80 neon-border-cyan rounded-lg overflow-hidden outline-none"
        style={{
          width: 400,
          height: 400,
        }}
        tabIndex={0}
      >
        {!isStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
            <button 
              onClick={resetGame}
              className="px-6 py-3 text-xl font-bold neon-border-magenta neon-text-magenta hover:bg-[#f0f]/20 transition-colors rounded"
            >
              START GAME
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 gap-4">
            <h2 className="text-4xl font-bold neon-text-red">GAME OVER</h2>
            <p className="text-xl text-gray-300">Final Score: {score}</p>
            <button 
              onClick={resetGame}
              className="px-6 py-3 mt-4 text-xl font-bold neon-border-cyan neon-text-cyan hover:bg-[#0ff]/20 transition-colors rounded"
            >
              PLAY AGAIN
            </button>
          </div>
        )}

        {/* Grid rendering */}
        <div 
          className="w-full h-full grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const bodyIndex = snake.findIndex((s, idx) => idx !== 0 && s.x === x && s.y === y);
            const isSnakeBody = bodyIndex !== -1;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`
                  w-full h-full border-[0.5px] border-gray-800/30 flex items-center justify-center
                  ${isSnakeHead ? 'z-10' : ''}
                `}
              >
                {isSnakeHead && (
                  <Ghost className="w-full h-full text-cyan-400 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]" />
                )}
                {isSnakeBody && (
                  <div 
                    className="w-full h-full bg-cyan-500 rounded-sm"
                    style={{
                      opacity: Math.max(0.2, 1 - (bodyIndex / snake.length)),
                      boxShadow: `0 0 ${10 + (1 - bodyIndex/snake.length)*10}px #0ff`
                    }}
                  />
                )}
                {isFood && (
                  <Zap className="w-full h-full text-fuchsia-500 drop-shadow-[0_0_8px_rgba(255,0,255,0.8)] animate-pulse" fill="currentColor" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="text-gray-500 text-sm flex gap-4">
        <span><kbd className="px-1 py-0.5 border border-gray-700 rounded">WASD</kbd> / <kbd className="px-1 py-0.5 border border-gray-700 rounded">Arrows</kbd> to move</span>
        <span><kbd className="px-1 py-0.5 border border-gray-700 rounded">Space</kbd> to pause</span>
      </div>
    </div>
  );
}
