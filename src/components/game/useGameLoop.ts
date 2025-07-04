
import { useEffect, useRef } from "react";
import { GAME_CONSTANTS, isColliding } from "./gameUtils";
import { useGameState } from "./useGameState";

export const useGameLoop = (gameState: ReturnType<typeof useGameState>, canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const animationId = useRef<number>();
  const keys = useRef<Record<string, boolean>>({});

  // Assets
  const hillsImg = useRef(new Image());
  const roverImg = useRef(new Image());
  const iceImg = useRef(new Image());
  const dustImg = useRef(new Image());
  const rockImg = useRef(new Image());

  // Load images once
  useEffect(() => {
    hillsImg.current.src = "/lovable-uploads/0a3db819-fa9b-43a5-85f7-c8fa75998d9b.png";
    roverImg.current.src = "/lovable-uploads/ecec65ca-3cd0-4791-917b-3eac62c8aa01.png";
    iceImg.current.src = "/lovable-uploads/2d686005-6624-4dfa-beae-25c3708b4ad0.png";
    dustImg.current.src = "/lovable-uploads/6880029a-1c2d-49a1-873b-e8edd82f4bdb.png";
    rockImg.current.src = "/lovable-uploads/5c716d72-ed18-4132-9b8c-1faf06d8de33.png";
  }, []);

  // Input handling
  useEffect(() => {
    const down = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const up = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Main game loop
  useEffect(() => {
    if (!gameState.gameStarted) return;
    const ctx = canvasRef.current!.getContext("2d")!;

    function drawBackground() {
      // sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, GAME_CONSTANTS.HEIGHT);
      grad.addColorStop(0, "#3a0f1d");
      grad.addColorStop(1, "#6b1e2e");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, GAME_CONSTANTS.WIDTH, GAME_CONSTANTS.HEIGHT);
      // hills parallax
      const offset = -(gameState.frame.current * 0.3) % GAME_CONSTANTS.WIDTH;
      ctx.drawImage(hillsImg.current, offset, GAME_CONSTANTS.HEIGHT - 120, GAME_CONSTANTS.WIDTH, 120);
      ctx.drawImage(hillsImg.current, offset + GAME_CONSTANTS.WIDTH, GAME_CONSTANTS.HEIGHT - 120, GAME_CONSTANTS.WIDTH, 120);
    }

    function loop() {
      if (gameState.gameOver) return;
      const f = gameState.frame.current;
      gameState.frame.current += 1;

      // Update signal strength based on distance from base (simulated)
      const distanceFromBase = Math.floor(f / 100);
      const newSignal = Math.max(20, 100 - distanceFromBase);
      gameState.setSignalStrength(newSignal);

      drawBackground();
      
      // spawn entities
      if (f % GAME_CONSTANTS.ICE_SPAWN_RATE === 0) gameState.spawnIce();
      if (f % GAME_CONSTANTS.DUST_SPAWN_RATE === 0) gameState.spawnDust();
      if (f % GAME_CONSTANTS.ROCK_SPAWN_RATE === 0) gameState.spawnRock();

      // move rover
      if (keys.current.ArrowLeft && gameState.rover.current.x > 0) 
        gameState.rover.current.x -= gameState.rover.current.speed;
      if (keys.current.ArrowRight && gameState.rover.current.x < GAME_CONSTANTS.WIDTH - gameState.rover.current.w) 
        gameState.rover.current.x += gameState.rover.current.speed;
      
      // draw rover
      ctx.drawImage(roverImg.current, gameState.rover.current.x, gameState.rover.current.y, gameState.rover.current.w, gameState.rover.current.h);

      // ice
      gameState.iceChunks.current.forEach((ice, idx) => {
        ice.y += GAME_CONSTANTS.ICE_SPEED + f * 0.0005; // Restored original speed
        ctx.drawImage(iceImg.current, ice.x, ice.y, GAME_CONSTANTS.ICE_SIZE, GAME_CONSTANTS.ICE_SIZE);
        if (isColliding(ice, gameState.rover.current, GAME_CONSTANTS.ICE_SIZE, GAME_CONSTANTS.ICE_SIZE)) {
          gameState.iceChunks.current.splice(idx, 1);
          gameState.setWaterPoints(w => w + GAME_CONSTANTS.WATER_POINTS_PER_ICE);
        }
      });
      
      // dust
      gameState.dusts.current.forEach((dust, idx) => {
        dust.y += GAME_CONSTANTS.DUST_SPEED + f * GAME_CONSTANTS.SPEED_INCREASE_FACTOR; // Restored original speed
        ctx.drawImage(dustImg.current, dust.x, dust.y, GAME_CONSTANTS.DUST_SIZE, GAME_CONSTANTS.DUST_SIZE);
        if (isColliding(dust, gameState.rover.current, GAME_CONSTANTS.DUST_SIZE, GAME_CONSTANTS.DUST_SIZE)) {
          gameState.endGame();
        }
      });
      
      // rocks
      gameState.rocks.current.forEach((rock, idx) => {
        rock.y += GAME_CONSTANTS.ROCK_SPEED + f * GAME_CONSTANTS.SPEED_INCREASE_FACTOR; // Restored original speed
        ctx.drawImage(rockImg.current, rock.x, rock.y, GAME_CONSTANTS.ROCK_WIDTH, GAME_CONSTANTS.ROCK_HEIGHT);
        if (isColliding(rock, gameState.rover.current, GAME_CONSTANTS.ROCK_WIDTH, GAME_CONSTANTS.ROCK_HEIGHT)) {
          gameState.endGame();
        }
      });

      // Update score
      gameState.setScore(Math.floor(f / 10));

      animationId.current = requestAnimationFrame(loop);
    }

    animationId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId.current!);
  }, [gameState]);

  return { animationId };
};
