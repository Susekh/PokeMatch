import { useState, useEffect, useRef, useCallback } from "react";
import PokemonCard from "./PokemonCard";
import EvolutionAnimation from "./EvolutionAnimation";
import { Trophy } from "lucide-react";
import gsap from "gsap";
import {
  getCardPairsForLevel,
  getPokemonOffsetForLevel,
  getGridColumnsForCards,
  getAIDifficultyForLevel,
} from "../../utils/DifficultyUtils";
import {
  saveHighScore,
  getHighScoreForMode,
  getHighestLevel,
} from "../../utils/LocalStorageUtils";
import { conf } from "../../utils/conf";
import ShimmerPokemonCard from "../loaders/ShimmerPokemonCard";

interface EvolutionPokemon {
  id: number;
  name: string;
  image: string;
}

interface Pokemon {
  id: number;
  name: string;
  image: string;
  evolutionChain?: {
    evolvesTo?: EvolutionPokemon;
  };
}

interface Species {
  name: string;
  url: string;
}

interface EvolutionNode {
  species: Species;
  evolves_to: EvolutionNode[];
}

interface Card extends Pokemon {
  flipped: boolean;
  matched: boolean;
  id: number;
}

interface GameBoardProps {
  level: number;
  gameMode: "single" | "multiplayer" | "ai" | null;
  currentPlayer: "player1" | "player2";
  onMatchFound: (multiplier?: number, evolutionBonus?: boolean) => void;
  onNoMatch: () => void;
  onLevelComplete: () => void;
  onGameComplete: () => void;
  aiPlayer?: "player1" | "player2";
  aiDifficulty?: "easy" | "medium" | "hard";
  score?: number;
}

interface EvolutionData {
  basePokemon: Pokemon;
  evolvedPokemon: EvolutionPokemon;
  cardIndices: number[];
}

interface PlayerBoard {
  cards: Card[];
  pokemon: Pokemon[];
  matchedPairs: number;
  consecutiveMatches: number;
}

// API endpoints
const POKEMON_API = conf.POKEMON_API;
const POKEMON_SPECIES_API = conf.POKEMON_SPECIES_API;

export default function GameBoard({
  level,
  gameMode,
  currentPlayer,
  onMatchFound,
  onNoMatch,
  onLevelComplete,
  // onGameComplete,
  aiPlayer,
  aiDifficulty = "medium",
  score = 0,
}: GameBoardProps) {
  // Store separate boards for each player
  const [boards, setBoards] = useState<{
    player1: PlayerBoard;
    player2: PlayerBoard;
  }>({
    player1: {
      cards: [],
      pokemon: [],
      matchedPairs: 0,
      consecutiveMatches: 0,
    },
    player2: {
      cards: [],
      pokemon: [],
      matchedPairs: 0,
      consecutiveMatches: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [disableFlip, setDisableFlip] = useState(false);
  const [showEvolution, setShowEvolution] = useState(false);
  const [evolutionData, setEvolutionData] = useState<EvolutionData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [highScore, setHighScoreInGameBoard] = useState(0);
  const [newHighScore, setNewHighScore] = useState(false);
  // Keep track of the previous player to detect player changes
  const previousPlayerRef = useRef<"player1" | "player2" | null>(null);

  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const aiMemory = useRef<Map<string, number[]>>(new Map());
  const boardRef = useRef<HTMLDivElement>(null);

  // Use dynamic card pairs based on level
  const totalPairs = useRef(getCardPairsForLevel(level));

  // Effective AI difficulty based on level and selected difficulty
  const effectiveAIDifficulty = getAIDifficultyForLevel(level, aiDifficulty);

  // Get grid columns based on number of cards
  const getGridColumns = useCallback(() => {
    return getGridColumnsForCards(totalPairs.current);
  }, []);

  // Track player changes and reset selected cards when player changes
  useEffect(() => {
    if (
      previousPlayerRef.current !== null &&
      previousPlayerRef.current !== currentPlayer
    ) {
      // Player has changed, reset selected cards and flip state
      setSelectedCards([]);
      setDisableFlip(false);
    }

    // Update previous player reference
    previousPlayerRef.current = currentPlayer;
  }, [currentPlayer]);

  // Update high score when score changes
  useEffect(() => {
    // Only check high score for single player mode
    if (
      gameMode === "single" ||
      (gameMode === "ai" && currentPlayer === "player1")
    ) {
      const currentHighScore = getHighScoreForMode(gameMode);

      console.log("Highest score ::", currentHighScore);

      setHighScoreInGameBoard(currentHighScore);

      // Update high score if current score is higher
      if (score > currentHighScore) {
        saveHighScore(score, level, gameMode);
        setHighScoreInGameBoard(score);
        setNewHighScore(true);
      }
    }
  }, [score, level, gameMode, currentPlayer]);

  // Shuffle array using Fisher-Yates algorithm for better randomization
  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  // Get current board based on current player
  // const getCurrentBoard = useCallback(() => {
  //   return boards[currentPlayer];
  // }, [boards, currentPlayer]);

  // Update current board
  const updateCurrentBoard = useCallback(
    (updater: (board: PlayerBoard) => PlayerBoard) => {
      setBoards((prevBoards) => ({
        ...prevBoards,
        [currentPlayer]: updater(prevBoards[currentPlayer]),
      }));
    },
    [currentPlayer]
  );

  // Check if level is complete
  const checkLevelCompletion = useCallback(() => {
    const currentBoard = boards[currentPlayer];

    if (currentBoard.matchedPairs + 1 >= totalPairs.current) {
      setTimeout(() => {
        // Save highest level reached
        const highestLevel = getHighestLevel();
        if (level > highestLevel) {
          localStorage.setItem("pokemon-memory-highest-level", String(level));
        }

        // No game "completion" in infinite mode, just move to next level
        onLevelComplete();
      }, 800);
    }
  }, [level, boards, currentPlayer, onLevelComplete]);

  // Handle evolution completion
  const handleEvolutionComplete = useCallback(() => {
    setShowEvolution(false);

    if (evolutionData) {
      // Evolve the matched cards in place
      updateCurrentBoard((board) => {
        const updatedCards = [...board.cards];

        // Update both matched cards with evolved Pokémon data
        evolutionData.cardIndices.forEach((index) => {
          updatedCards[index] = {
            ...updatedCards[index],
            name: evolutionData.evolvedPokemon.name,
            image: evolutionData.evolvedPokemon.image,
            matched: true,
            flipped: true,
          };
        });

        return {
          ...board,
          cards: updatedCards,
          matchedPairs: board.matchedPairs + 1,
        };
      });

      setSelectedCards([]);
      setDisableFlip(false);

      // Highlight evolved cards with GSAP
      setTimeout(() => {
        evolutionData.cardIndices.forEach((index) => {
          const cardElement = document.querySelector(
            `[data-card-id="${index}"]`
          ) as HTMLElement;
          if (cardElement) {
            gsap.fromTo(
              cardElement,
              { boxShadow: "0 0 0 rgba(250, 204, 21, 0)" },
              {
                boxShadow: "0 0 20px 5px rgba(250, 204, 21, 0.7)",
                duration: 1,
                repeat: 1,
                yoyo: true,
                ease: "power2.inOut",
              }
            );
          }
        });
      }, 300);

      // Check if level is complete
      checkLevelCompletion();
    }
  }, [evolutionData, updateCurrentBoard, checkLevelCompletion]);

  // Handle card flipping
const handleCardFlip = useCallback(
  (index: number) => {
    const currentBoard = boards[currentPlayer];
    
    // Create audio element for swipe sound
    const swipeSound = new Audio("/audio/swipe.mp3");

    if (
      disableFlip ||
      currentBoard.cards[index]?.flipped ||
      currentBoard.cards[index]?.matched ||
      selectedCards.length >= 2
    ) {
      return;
    }

    // Play swipe sound when card is clicked
    swipeSound.volume = 0.7; // Adjust volume as needed
    swipeSound.currentTime = 0; // Reset audio to start
    swipeSound.play().catch(error => {
      // Handle any autoplay restrictions silently
      console.log("Audio playback prevented:", error);
    });

    // Flip the card visually
    const cardElement = document.querySelector(
      `[data-card-id="${index}"]`
    ) as HTMLElement;
    if (cardElement) {
      gsap.to(cardElement, {
        rotationY: 180,
        duration: 0.1,
        ease: "expo",
      });
    }

    // Update flipped state
    updateCurrentBoard((board) => {
      const updatedCards = [...board.cards];
      updatedCards[index] = { ...updatedCards[index], flipped: true };
      return { ...board, cards: updatedCards };
    });

    // Track selection
    const newSelectedCards = [...selectedCards, index];
    setSelectedCards(newSelectedCards);

    // AI memory update
    if (gameMode === "ai" && currentPlayer === aiPlayer) {
      const cardName = currentBoard.cards[index].name;
      const currentPositions = aiMemory.current.get(cardName) || [];
      if (!currentPositions.includes(index)) {
        aiMemory.current.set(cardName, [...currentPositions, index]);
      }
    }

    // Match logic
    if (newSelectedCards.length === 2) {
      setDisableFlip(true);

      const [firstIndex, secondIndex] = newSelectedCards;
      const firstCard = currentBoard.cards[firstIndex];
      const secondCard = currentBoard.cards[secondIndex];

      if (firstCard.name === secondCard.name) {
        // ✅ MATCH
        setTimeout(() => {
          updateCurrentBoard((board) => {
            const updatedCards = [...board.cards];
            updatedCards[firstIndex] = {
              ...updatedCards[firstIndex],
              matched: true,
            };
            updatedCards[secondIndex] = {
              ...updatedCards[secondIndex],
              matched: true,
            };
            const newConsecutiveMatches = board.consecutiveMatches + 1;

            return {
              ...board,
              cards: updatedCards,
              consecutiveMatches: newConsecutiveMatches,
            };
          });

          const newConsecutiveMatches = currentBoard.consecutiveMatches + 1;
          const multiplier = Math.min(3, newConsecutiveMatches);

          const matchedPokemon = currentBoard.pokemon.find(
            (p) => p.name === firstCard.name
          );
          if (matchedPokemon?.evolutionChain?.evolvesTo) {
            setEvolutionData({
              basePokemon: matchedPokemon,
              evolvedPokemon: matchedPokemon.evolutionChain.evolvesTo,
              cardIndices: [firstIndex, secondIndex],
            });

            setShowEvolution(true);
            onMatchFound(multiplier, true);
          } else {
            setSelectedCards([]);

            updateCurrentBoard((board) => ({
              ...board,
              matchedPairs: board.matchedPairs + 1,
            }));

            onMatchFound(multiplier, false);
            setDisableFlip(false);
            checkLevelCompletion();
          }
        }, 1000);
      } else {
        // ❌ NO MATCH
        setTimeout(() => {
          // Visual unflip
          const firstCardElement = document.querySelector(
            `[data-card-id="${firstIndex}"]`
          ) as HTMLElement;
          const secondCardElement = document.querySelector(
            `[data-card-id="${secondIndex}"]`
          ) as HTMLElement;

          if (firstCardElement && secondCardElement) {
            gsap.to([firstCardElement, secondCardElement], {
              rotationY: 0,
              duration: 0.1,
              ease: "power2.out",
            });
          }

          // Delay logic for card state update and board change
          setTimeout(() => {
            updateCurrentBoard((board) => {
              const updatedCards = [...board.cards];
              updatedCards[firstIndex] = {
                ...updatedCards[firstIndex],
                flipped: false,
              };
              updatedCards[secondIndex] = {
                ...updatedCards[secondIndex],
                flipped: false,
              };

              return {
                ...board,
                cards: updatedCards,
                consecutiveMatches: 0,
              };
            });

            setSelectedCards([]);
            onNoMatch();
            setDisableFlip(false);

            // ❗✅ Put logic to switch player or board here AFTER unflipping is fully done
            // e.g., setCurrentPlayer(prev => (prev + 1) % 2) or handleNextTurn()
          }, 300); // wait for GSAP to finish
        }, 1500); // wait to show mismatched cards before flipping back
      }
    }
  },
  [
    boards,
    currentPlayer,
    selectedCards,
    disableFlip,
    gameMode,
    aiPlayer,
    onMatchFound,
    onNoMatch,
    checkLevelCompletion,
    updateCurrentBoard,
  ]
);

  // Fetch evolution chain data with error handling
  const fetchEvolutionData = useCallback(
    async (
      pokemonId: number
    ): Promise<{
      evolutionChain?: { evolvesTo?: EvolutionPokemon };
    }> => {
      try {
        const speciesRes = await fetch(`${POKEMON_SPECIES_API}/${pokemonId}/`);
        if (!speciesRes.ok) {
          throw new Error(`Failed to fetch species data: ${speciesRes.status}`);
        }

        const speciesData = await speciesRes.json();
        if (!speciesData.evolution_chain?.url) {
          return {};
        }

        const evolutionRes = await fetch(speciesData.evolution_chain.url);
        if (!evolutionRes.ok) {
          throw new Error(
            `Failed to fetch evolution data: ${evolutionRes.status}`
          );
        }

        const evolutionData = await evolutionRes.json();
        const currentPokemonName = speciesData.name.toLowerCase();

        // Check if this Pokémon is the base form
        if (
          evolutionData.chain.species.name === currentPokemonName &&
          evolutionData.chain.evolves_to.length > 0
        ) {
          // Get the first evolution
          const evolvesToName = evolutionData.chain.evolves_to[0].species.name;
          const evolvedRes = await fetch(`${POKEMON_API}/${evolvesToName}`);

          if (!evolvedRes.ok) {
            throw new Error(
              `Failed to fetch evolved Pokémon: ${evolvedRes.status}`
            );
          }

          const evolvedDetails = await evolvedRes.json();
          return {
            evolutionChain: {
              evolvesTo: {
                id: evolvedDetails.id,
                name: evolvedDetails.name,
                image:
                  evolvedDetails.sprites.other["official-artwork"]
                    .front_default || evolvedDetails.sprites.front_default,
              },
            },
          };
        }

        // Check if this is in the first evolution
        if (evolutionData.chain.evolves_to.length > 0) {
          const firstEvolution = evolutionData.chain.evolves_to.find(
            (e: EvolutionNode) => e.species.name === currentPokemonName
          );

          if (firstEvolution && firstEvolution.evolves_to.length > 0) {
            // Get the second evolution
            const evolvesToName = firstEvolution.evolves_to[0].species.name;
            const evolvedRes = await fetch(`${POKEMON_API}/${evolvesToName}`);

            if (evolvedRes.status !== 200) {
              throw new Error(
                `Failed to fetch evolved Pokémon: ${evolvedRes.status}`
              );
            }

            const evolvedDetails = await evolvedRes.json();
            return {
              evolutionChain: {
                evolvesTo: {
                  id: evolvedDetails.id,
                  name: evolvedDetails.name,
                  image:
                    evolvedDetails.sprites.other["official-artwork"]
                      .front_default || evolvedDetails.sprites.front_default,
                },
              },
            };
          }
        }

        return {};
      } catch (error) {
        console.error("Error fetching evolution data:", error);
        return {};
      }
    },
    []
  );

  // Create a board for a specific player with level-appropriate difficulty
  const createBoardForPlayer = useCallback(
    async (playerKey: "player1" | "player2", baseOffset: number) => {
      const retryFetch = async (
        url: string,
        retries = 3
      ): Promise<Response> => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          return response;
        } catch (error) {
          if (retries <= 0) throw error;
          // Exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (4 - retries))
          );
          return retryFetch(url, retries - 1);
        }
      };

      try {
        const numberOfPairs = totalPairs.current;

        // Get level-appropriate offset for more variety as levels increase
        const playerOffset =
          getPokemonOffsetForLevel(level, baseOffset) +
          (playerKey === "player2" ? 150 : 0);

        const response = await retryFetch(
          `${POKEMON_API}?limit=${numberOfPairs}&offset=${playerOffset}`
        );
        const data = await response.json();

        const pokemonPromises = data.results.map(async (p: { url: string }) => {
          const res = await retryFetch(p.url);
          const details = await res.json();

          // Fetch evolution data in parallel
          const evolutionData = await fetchEvolutionData(details.id);

          return {
            id: details.id,
            name: details.name,
            image:
              details.sprites.other["official-artwork"].front_default ||
              details.sprites.front_default,
            ...evolutionData, // Spread in any evolution data
          };
        });

        const pokemonDetails = await Promise.all(pokemonPromises);

        // Create pairs of cards
        const cardPairs = shuffleArray([
          ...pokemonDetails.map((p, idx) => ({
            ...p,
            flipped: false,
            matched: false,
            id: idx,
          })),
          ...pokemonDetails.map((p, idx) => ({
            ...p,
            flipped: false,
            matched: false,
            id: idx + pokemonDetails.length,
          })),
        ]);

        // Return the player's board data
        return {
          cards: cardPairs,
          pokemon: pokemonDetails,
          matchedPairs: 0,
          consecutiveMatches: 0,
        };
      } catch (error) {
        console.error(`Error creating board for ${playerKey}:`, error);
        throw error;
      }
    },
    [level, fetchEvolutionData, shuffleArray]
  );

  // Fetch Pokemon data with error handling and retries for both players
  const fetchPokemon = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Update total pairs based on current level
      totalPairs.current = getCardPairsForLevel(level);

      // Use a varied offset to get different Pokémon each time
      const baseOffset = Math.floor(Math.random() * 650);

      // Create boards for both players in parallel
      const [player1Board, player2Board] = await Promise.all([
        createBoardForPlayer("player1", baseOffset),
        createBoardForPlayer("player2", baseOffset),
      ]);

      // Update the boards state
      setBoards({
        player1: player1Board,
        player2: player2Board,
      });

      // Reset other game state
      setSelectedCards([]);
      aiMemory.current.clear();
    } catch (error) {
      console.error("Error fetching Pokemon:", error);
      setError("Failed to load Pokémon. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [level, createBoardForPlayer]);

  // Fetch cards when level changes
  useEffect(() => {
    fetchPokemon();

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
      }
    };
  }, [level, fetchPokemon]);

  // Add entrance animation for cards
  // useEffect(() => {
  //   if (!loading && boardRef.current) {
  //     const cards = boardRef.current.querySelectorAll(".card-container");

  //     gsap.fromTo(
  //       cards,
  //       {
  //         scale: 0.8,
  //         opacity: 0,
  //         y: 20,
  //       },
  //       {
  //         scale: 1,
  //         opacity: 1,
  //         y: 0,
  //         stagger: 0.03,
  //         duration: 0.5,
  //         ease: "back.out(1.7)",
  //         clearProps: "all", // Clean up after animation for better performance
  //       }
  //     );
  //   }
  // }, [loading, currentPlayer]);

  useEffect(() => {
    if (gameMode === "multiplayer") {
      updateCurrentBoard((board) => {
        const updatedCards = board.cards.map((card) => {
          // Flip back cards that are flipped but not matched
          if (card.flipped && !card.matched) {
            return { ...card, flipped: false };
          }
          return card;
        });

        return {
          ...board,
          cards: updatedCards,
        };
      });
    }
  }, [currentPlayer, gameMode, updateCurrentBoard]);

  // AI player logic with improved memory and strategy based on difficulty
  useEffect(() => {
    if (
      gameMode !== "ai" ||
      currentPlayer !== aiPlayer ||
      loading ||
      disableFlip
    ) {
      return;
    }

    const currentBoard = boards[currentPlayer];

    // Clear any existing timeout
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }

    aiTimeoutRef.current = setTimeout(() => {
      const unflippedCards = currentBoard.cards.filter(
        (card) => !card.flipped && !card.matched
      );

      // If no cards left to flip, return
      if (unflippedCards.length === 0) return;

      let firstCardIndex = -1;
      let secondCardIndex = -1;

      // AI difficulty affects strategy
      const useMemory =
        effectiveAIDifficulty === "hard" ||
        (effectiveAIDifficulty === "medium" && Math.random() > 0.2) ||
        (effectiveAIDifficulty === "easy" && Math.random() > 0.7);

      if (useMemory) {
        // Check if we can make a match from memory
        for (const [positions] of aiMemory.current.entries()) {
          // Find unflipped positions for this card type
          // Ensure `positions` is a string before splitting
          if (typeof positions !== "string") {
            console.error(
              "Expected positions to be a string but got:",
              positions
            );
            continue;
          }

          const positionsArray: number[] = positions
            .split(",")
            .map((val) => Number(val))
            .filter((num) => Number.isInteger(num));

          const availablePositions = positionsArray.filter(
            (pos) =>
              pos >= 0 &&
              pos < currentBoard.cards.length &&
              currentBoard.cards[pos] &&
              !currentBoard.cards[pos].flipped &&
              !currentBoard.cards[pos].matched
          );

          if (availablePositions.length >= 2) {
            // We have a match in memory!
            firstCardIndex = availablePositions[0];
            secondCardIndex = availablePositions[1];
            break;
          }
        }
      }

      // If no match in memory or not using memory, try a different strategy
      if (firstCardIndex === -1) {
        // Pick a random card
        const randomIndex = Math.floor(Math.random() * unflippedCards.length);
        firstCardIndex = currentBoard.cards.findIndex(
          (card) => card.id === unflippedCards[randomIndex].id
        );

        // Flip first card
        handleCardFlip(firstCardIndex);

        // AI waits before flipping second card
        aiTimeoutRef.current = setTimeout(() => {
          // Check if we have the matching card in memory
          const firstCardName = currentBoard.cards[firstCardIndex].name;
          const matchingPositions = aiMemory.current.get(firstCardName) || [];

          // Filter out the first card's position and already matched/flipped cards
          const availableMatches = matchingPositions.filter(
            (pos) =>
              pos !== firstCardIndex &&
              !currentBoard.cards[pos].flipped &&
              !currentBoard.cards[pos].matched
          );

          if (useMemory && availableMatches.length > 0) {
            // We know where the matching card is!
            secondCardIndex = availableMatches[0];
          } else {
            // Pick a random second card that's not the first one
            const remainingUnflipped = unflippedCards.filter(
              (card) =>
                currentBoard.cards.findIndex((c) => c.id === card.id) !==
                firstCardIndex
            );

            if (remainingUnflipped.length > 0) {
              const randomSecondIndex = Math.floor(
                Math.random() * remainingUnflipped.length
              );
              secondCardIndex = currentBoard.cards.findIndex(
                (card) => card.id === remainingUnflipped[randomSecondIndex].id
              );
            }
          }

          // Flip second card if available
          if (secondCardIndex >= 0) {
            handleCardFlip(secondCardIndex);
          }
        }, 1000);
      } else {
        // We have a match in memory, flip both cards with a delay
        handleCardFlip(firstCardIndex);

        aiTimeoutRef.current = setTimeout(() => {
          handleCardFlip(secondCardIndex);
        }, 1000);
      }
    }, 1500);

    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = null;
      }
    };
  }, [
    currentPlayer,
    gameMode,
    aiPlayer,
    boards,
    loading,
    disableFlip,
    effectiveAIDifficulty,
    handleCardFlip,
  ]);

  // Loading state
  if (loading) {
    return (
      <div>
      <h1 className="text-xl text-gray-500 font-general p-4">Loading Pokémons...</h1>
      <ShimmerPokemonCard />
    </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <p className="text-lg mb-4">{error}</p>
        <button
          onClick={fetchPokemon}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Get current board data
  const currentBoardData = boards[currentPlayer];

  return (
    <>
      {/* High Score Display */}
      {
        <div
          className="flex items-center justify-center mb-4 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-yellow-300 max-w-max mx-auto"
          style={{ boxShadow: "0 4px 12px rgba(255, 255, 255, 0.05)" }}
        >
          <Trophy className="w-4 h-4 mr-1.5 text-yellow-400" />
          <span className="text-xs md:text-sm font-medium select-none">
            {newHighScore ? "New High Score!" : `High Score: ${highScore}`}
          </span>
        </div>
      }

      <div
        ref={boardRef}
        className="bg-gradient-to-br from-gray-700/30 via-slate-800/20 to-blue-900/20
             backdrop-blur-2xl border border-white/10
             rounded-2xl p-4 md:p-6
             shadow-[0_6px_24px_0_rgba(0,0,0,0.2)]
             ring-1 ring-white/10 transition-all duration-300"
      >
        <div className={`grid ${getGridColumns()} gap-3 md:gap-4`}>
          {currentBoardData.cards.map((card, index) => (
            <PokemonCard
              key={card.id}
              pokemon={card}
              onClick={() => handleCardFlip(index)}
              disabled={disableFlip || currentPlayer === aiPlayer}
              currentPlayer={currentPlayer}
              cardIndex={index}
            />
          ))}
        </div>
      </div>

      {/* Evolution Animation */}
      {showEvolution && evolutionData && (
        <EvolutionAnimation
          basePokemon={evolutionData.basePokemon}
          evolvedPokemon={evolutionData.evolvedPokemon}
          onComplete={handleEvolutionComplete}
        />
      )}
    </>
  );
}
