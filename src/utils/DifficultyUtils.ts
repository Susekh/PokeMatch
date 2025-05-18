/**
 * Utility functions for game difficulty scaling and level management
 */

/**
 * Calculate number of card pairs based on level with progressive scaling
 * This function scales infinitely with level
 * 
 * @param level Current game level
 * @returns Number of card pairs for this level
 */
export const getCardPairsForLevel = (level: number): number => {
  // Base difficulty
  if (level <= 3) return 6;   // Levels 1-3: 12 cards (6 pairs)
  if (level <= 6) return 8;   // Levels 4-6: 16 cards (8 pairs)
  if (level <= 9) return 10;  // Levels 7-9: 20 cards (10 pairs)
  if (level <= 12) return 12; // Levels 10-12: 24 cards (12 pairs)
  
  // After level 12, scale by adding one pair every 2 levels
  // This creates a smooth difficulty curve that can extend infinitely
  const additionalPairs = Math.floor((level - 12) / 2);
  return Math.min(20, 12 + additionalPairs); // Cap at 20 pairs (40 cards) for playability
}

/**
 * Calculate Pokémon offset based on level
 * This ensures different Pokémon appear in higher levels
 * 
 * @param level Current game level
 * @param baseOffset Random base offset for variety
 * @returns Calculated offset for Pokémon API
 */
export const getPokemonOffsetForLevel = (level: number, baseOffset: number = 0): number => {
  // Cycle through different Pokémon generations as levels increase
  const levelGroup = Math.floor((level - 1) / 5);
  const generationOffset = (levelGroup % 8) * 150; // 8 pseudo-generations of ~150 Pokémon
  
  // Add some randomness within each generation
  const randomOffset = baseOffset % 80;
  
  return generationOffset + randomOffset;
}

/**
 * Get grid columns CSS class based on number of cards
 * 
 * @param cardPairs Number of card pairs in the current level
 * @returns CSS class string for grid layout
 */
export const getGridColumnsForCards = (cardPairs: number): string => {
  if (cardPairs <= 6) return "grid-cols-3 md:grid-cols-4";
  if (cardPairs <= 8) return "grid-cols-4";
  if (cardPairs <= 10) return "grid-cols-4 md:grid-cols-5";
  if (cardPairs <= 15) return "grid-cols-4 md:grid-cols-6";
  return "grid-cols-5 md:grid-cols-8"; // For very high levels with many cards
}

/**
 * Calculate an appropriate timer duration based on level and number of cards
 * 
 * @param level Current game level
 * @param cardPairs Number of card pairs
 * @returns Time in seconds for the level timer
 */
export const getTimerDurationForLevel = (level: number, cardPairs: number): number => {
  // Base time per pair
  const baseTimePerPair = 30;
  
  // Calculate base time based on number of pairs
  let baseTime = cardPairs * baseTimePerPair;
  
  // As levels increase, time gets a bit tighter
  const difficultyFactor = Math.max(0.8, 1 - (level * 0.01));
  
  return Math.round(baseTime * difficultyFactor);
}

/**
 * Calculate how many evolution pairs should be in a level
 * 
 * @param level Current game level
 * @param cardPairs Total number of card pairs
 * @returns Target number of evolution pairs
 */
export const getEvolutionPairsForLevel = (level: number, cardPairs: number): number => {
  // Start introducing evolutions at level 3
  if (level < 3) return 0;
  
  // Gradually increase the number of evolution pairs
  const baseEvolutions = Math.floor(level / 3);
  
  // Cap at 40-50% of the total pairs
  return Math.min(baseEvolutions, Math.floor(cardPairs * 0.4));
}

/**
 * Calculate appropriate AI difficulty based on player's level
 * 
 * @param level Current game level
 * @param selectedDifficulty User-selected difficulty
 * @returns AI difficulty setting
 */
export const getAIDifficultyForLevel = (
  level: number, 
  selectedDifficulty: "easy" | "medium" | "hard"
): "easy" | "medium" | "hard" => {
  // If player selected a specific difficulty, respect it
  if (selectedDifficulty !== "medium") return selectedDifficulty;
  
  // Otherwise, scale difficulty with level
  if (level <= 3) return "easy";
  if (level <= 8) return "medium";
  return "hard";
}

/**
 * Calculate points for matching a pair
 * 
 * @param level Current game level
 * @param timeBonusFactor Remaining time bonus factor (0-1)
 * @param isEvolution Whether this was an evolution match
 * @param consecutiveMatches Number of consecutive matches made
 * @returns Points awarded for this match
 */
export const calculateMatchPoints = (
  level: number,
  timeBonusFactor: number = 1,
  isEvolution: boolean = false,
  consecutiveMatches: number = 1
): number => {
  // Base points per match
  const basePoints = 100;
  
  // Level multiplier increases with level
  const levelMultiplier = 1 + (level * 0.1);
  
  // Consecutive match bonus (1x, 2x, 3x)
  const comboMultiplier = Math.min(3, consecutiveMatches);
  
  // Evolution bonus
  const evolutionMultiplier = isEvolution ? 1.5 : 1;
  
  // Time bonus
  const timeBonus = Math.max(0.5, timeBonusFactor);
  
  // Calculate total points
  return Math.round(
    basePoints * levelMultiplier * comboMultiplier * evolutionMultiplier * timeBonus
  );
}