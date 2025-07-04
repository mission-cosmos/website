
export const GAME_CONSTANTS = {
  WIDTH: 640,
  HEIGHT: 360,
  ROVER_SPEED: 8, // Restored original speed
  ROVER_WIDTH: 64,
  ROVER_HEIGHT: 48,
  ICE_SIZE: 16,
  DUST_SIZE: 32,
  ROCK_WIDTH: 28,
  ROCK_HEIGHT: 24,
  ICE_SPAWN_RATE: 90,
  DUST_SPAWN_RATE: 150,
  ROCK_SPAWN_RATE: 200,
  ICE_SPEED: 2, // Base speed
  DUST_SPEED: 1.5, // Base speed  
  ROCK_SPEED: 1.8, // Base speed
  SPEED_INCREASE_FACTOR: 0.003, // Restored original speed increase
  WATER_POINTS_PER_ICE: 50
};

export const isColliding = (a: any, b: any, aw: number, ah: number) => {
  return (
    a.x < b.x + b.w &&
    a.x + aw > b.x &&
    a.y < b.y + b.h &&
    a.y + ah > b.y
  );
};

export const getSignalColor = (signalStrength: number) => {
  if (signalStrength > 70) return "text-green-400";
  if (signalStrength > 40) return "text-yellow-400";
  return "text-red-400";
};
