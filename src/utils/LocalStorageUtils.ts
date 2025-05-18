type GameMode = 'single' | 'multiplayer' | 'ai';
type PlayerStats = Record<string, any>;
type GameSettings = Record<string, any>;

const STORAGE_KEYS = {
  HIGH_SCORE: 'pokemon-memory-high-score',
  HIGHEST_LEVEL: 'pokemon-memory-highest-level',
  PLAYER_STATS: 'pokemon-memory-player-stats',
  GAME_SETTINGS: 'pokemon-memory-settings',
} as const;

// Helper to get item from localStorage and parse
const getParsedItem = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

// Helper to safely set item
const setItem = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving to localStorage [${key}]:`, err);
  }
};

// High Score Functions

export const getHighScores = (): Record<GameMode, number> => {
  return getParsedItem<Record<GameMode, number>>(STORAGE_KEYS.HIGH_SCORE, {
    single: 0,
    multiplayer: 0,
    ai: 0,
  });
};

export const getHighScoreForMode = (mode: GameMode): number => {
  const scores = getHighScores();
  return scores[mode] ?? 0;
};

export const saveHighScore = (
  score: number,
  level: number,
  gameMode: GameMode
): void => {
  const highScores = getHighScores();
  highScores[gameMode] = Math.max(highScores[gameMode] ?? 0, score);
  setItem(STORAGE_KEYS.HIGH_SCORE, highScores);

  const highestLevel = getHighestLevel();
  setHighestLevel(Math.max(highestLevel, level));
};

// Highest Level

export const getHighestLevel = (): number => {
  const raw = localStorage.getItem(STORAGE_KEYS.HIGHEST_LEVEL);
  return raw ? parseInt(raw, 10) : 1;
};

export const setHighestLevel = (level: number): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.HIGHEST_LEVEL, String(level));
  } catch (err) {
    console.error("Error saving highest level:", err);
  }
};

// Player Stats

export const getPlayerStats = (): PlayerStats => {
  return getParsedItem<PlayerStats>(STORAGE_KEYS.PLAYER_STATS, {});
};

export const savePlayerStats = (stats: PlayerStats): void => {
  setItem(STORAGE_KEYS.PLAYER_STATS, stats);
};

// Game Settings

export const getGameSettings = (): GameSettings => {
  return getParsedItem<GameSettings>(STORAGE_KEYS.GAME_SETTINGS, {});
};

export const saveGameSettings = (settings: GameSettings): void => {
  setItem(STORAGE_KEYS.GAME_SETTINGS, settings);
};

// Clear All Game Data

export const clearGameData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  } catch (err) {
    console.error("Error clearing game data:", err);
  }
};
