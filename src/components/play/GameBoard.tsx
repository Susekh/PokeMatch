import { useState, useEffect, useRef, useCallback } from "react"
import PokemonCard from "./PokemonCard"
import EvolutionAnimation from "./EvolutionAnimation"
import { Loader2 } from "lucide-react"
import gsap from "gsap"

// Type definitions for better type safety
interface EvolutionPokemon {
  id: number
  name: string
  image: string
}

interface Pokemon {
  id: number
  name: string
  image: string
  evolutionChain?: {
    evolvesTo?: EvolutionPokemon
  }
}

interface Card extends Pokemon {
  flipped: boolean
  matched: boolean
  id: number
}

interface GameBoardProps {
  level: number
  gameMode: "single" | "multiplayer" | "ai" | null
  currentPlayer: "player1" | "player2"
  onMatchFound: (multiplier?: number, evolutionBonus?: boolean) => void
  onNoMatch: () => void
  onLevelComplete: () => void
  onGameComplete: () => void
  aiPlayer?: "player1" | "player2"
  aiDifficulty?: "easy" | "medium" | "hard"
}

interface EvolutionData {
  basePokemon: Pokemon
  evolvedPokemon: EvolutionPokemon
  cardIndices: number[]
}

// API endpoints
const POKEMON_API = "https://pokeapi.co/api/v2/pokemon"
const POKEMON_SPECIES_API = "https://pokeapi.co/api/v2/pokemon-species"

export default function GameBoard({
  level,
  gameMode,
  currentPlayer,
  onMatchFound,
  onNoMatch,
  onLevelComplete,
  onGameComplete,
  aiPlayer,
  aiDifficulty = "medium",
}: GameBoardProps) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [disableFlip, setDisableFlip] = useState(false)
  const [consecutiveMatches, setConsecutiveMatches] = useState(0)
  const [showEvolution, setShowEvolution] = useState(false)
  const [evolutionData, setEvolutionData] = useState<EvolutionData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const aiMemory = useRef<Map<string, number[]>>(new Map())
  const boardRef = useRef<HTMLDivElement>(null)
  const totalPairs = useRef(getNumberOfPairs(level))

  // Calculate number of pairs based on level with memoization
  function getNumberOfPairs(currentLevel: number): number {
    if (currentLevel <= 3) return 6
    if (currentLevel <= 6) return 8
    if (currentLevel <= 9) return 10
    return 12
  }

  // Get grid columns based on number of cards
  const getGridColumns = useCallback(() => {
    const pairs = totalPairs.current
    if (pairs <= 6) return "grid-cols-3 md:grid-cols-4"
    if (pairs <= 8) return "grid-cols-4"
    if (pairs <= 10) return "grid-cols-4 md:grid-cols-5"
    return "grid-cols-4 md:grid-cols-6"
  }, [])

  // Shuffle array using Fisher-Yates algorithm for better randomization
  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }, [])

  // Check if level is complete
  const checkLevelCompletion = useCallback(() => {
    if (matchedPairs + 1 >= totalPairs.current) {
      setTimeout(() => {
        if (level >= 10) {
          onGameComplete()
        } else {
          onLevelComplete()
        }
      }, 800)
    }
  }, [level, matchedPairs, onGameComplete, onLevelComplete])

  // Handle evolution completion
  const handleEvolutionComplete = useCallback(() => {
    setShowEvolution(false)

    if (evolutionData) {
      // Evolve the matched cards in place
      setCards(prevCards => {
        const updatedCards = [...prevCards]
        
        // Update both matched cards with evolved Pokémon data
        evolutionData.cardIndices.forEach((index) => {
          updatedCards[index] = {
            ...updatedCards[index],
            name: evolutionData.evolvedPokemon.name,
            image: evolutionData.evolvedPokemon.image,
            matched: true,
            flipped: true,
          }
        })
        
        return updatedCards
      })
      
      setSelectedCards([])
      setMatchedPairs((prev) => prev + 1)
      setDisableFlip(false)

      // Highlight evolved cards with GSAP
      setTimeout(() => {
        evolutionData.cardIndices.forEach((index) => {
          const cardElement = document.querySelector(`[data-card-id="${index}"]`) as HTMLElement
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
              },
            )
          }
        })
      }, 300)

      // Check if level is complete
      checkLevelCompletion()
    }
  }, [evolutionData, checkLevelCompletion])

  // Handle card flipping
  const handleCardFlip = useCallback((index: number) => {
    if (disableFlip || cards[index]?.flipped || cards[index]?.matched || selectedCards.length >= 2) {
      return
    }

    // Flip the card with GSAP animation
    const cardElement = document.querySelector(`[data-card-id="${index}"]`) as HTMLElement
    if (cardElement) {
      gsap.to(cardElement, {
        rotationY: 180,
        duration: 0.6,
        ease: "power2.out",
      })
    }

    // Update card state
    setCards(prevCards => {
      const updatedCards = [...prevCards]
      updatedCards[index].flipped = true
      return updatedCards
    })

    // Add to selected cards
    const newSelectedCards = [...selectedCards, index]
    setSelectedCards(newSelectedCards)

    // Add to AI memory - store all positions of each card type
    if (gameMode === "ai") {
      const cardName = cards[index].name
      const currentPositions = aiMemory.current.get(cardName) || []
      if (!currentPositions.includes(index)) {
        aiMemory.current.set(cardName, [...currentPositions, index])
      }
    }

    // Check for a match if two cards are selected
    if (newSelectedCards.length === 2) {
      setDisableFlip(true)

      const [firstIndex, secondIndex] = newSelectedCards
      const firstCard = cards[firstIndex]
      const secondCard = cards[secondIndex]

      if (firstCard.name === secondCard.name) {
        // Match found
        setTimeout(() => {
          setCards(prevCards => {
            const updatedCards = [...prevCards]
            updatedCards[firstIndex].matched = true
            updatedCards[secondIndex].matched = true
            return updatedCards
          })

          // Increase consecutive matches counter for multiplier
          const newConsecutiveMatches = consecutiveMatches + 1
          setConsecutiveMatches(newConsecutiveMatches)

          // Calculate multiplier based on consecutive matches
          const multiplier = Math.min(3, newConsecutiveMatches)

          // Check if the matched Pokémon can evolve
          const matchedPokemon = pokemon.find((p) => p.name === firstCard.name)
          if (matchedPokemon?.evolutionChain?.evolvesTo) {
            // Set evolution data
            setEvolutionData({
              basePokemon: matchedPokemon,
              evolvedPokemon: matchedPokemon.evolutionChain.evolvesTo,
              cardIndices: [firstIndex, secondIndex],
            })

            // Show evolution animation
            setShowEvolution(true)

            // Award points with evolution bonus
            onMatchFound(multiplier, true)
          } else {
            // No evolution, just award regular points
            setSelectedCards([])
            setMatchedPairs((prev) => prev + 1)
            onMatchFound(multiplier, false)
            setDisableFlip(false)

            // Check if level is complete
            checkLevelCompletion()
          }
        }, 1000)
      } else {
        // No match
        setTimeout(() => {
          // Flip cards back with GSAP
          const firstCardElement = document.querySelector(`[data-card-id="${firstIndex}"]`) as HTMLElement
          const secondCardElement = document.querySelector(`[data-card-id="${secondIndex}"]`) as HTMLElement

          if (firstCardElement && secondCardElement) {
            gsap.to([firstCardElement, secondCardElement], {
              rotationY: 0,
              duration: 0.6,
              ease: "power2.out",
            })
          }

          setCards(prevCards => {
            const updatedCards = [...prevCards]
            updatedCards[firstIndex].flipped = false
            updatedCards[secondIndex].flipped = false
            return updatedCards
          })
          
          setSelectedCards([])
          setConsecutiveMatches(0)
          onNoMatch()
          setDisableFlip(false)
        }, 1500)
      }
    }
  }, [cards, selectedCards, disableFlip, consecutiveMatches, pokemon, gameMode, onMatchFound, onNoMatch, checkLevelCompletion])

  // Fetch evolution chain data with error handling
  const fetchEvolutionData = useCallback(async (pokemonId: number): Promise<{
    evolutionChain?: { evolvesTo?: EvolutionPokemon }
  }> => {
    try {
      const speciesRes = await fetch(`${POKEMON_SPECIES_API}/${pokemonId}/`)
      if (!speciesRes.ok) {
        throw new Error(`Failed to fetch species data: ${speciesRes.status}`)
      }
      
      const speciesData = await speciesRes.json()
      if (!speciesData.evolution_chain?.url) {
        return {}
      }

      const evolutionRes = await fetch(speciesData.evolution_chain.url)
      if (!evolutionRes.ok) {
        throw new Error(`Failed to fetch evolution data: ${evolutionRes.status}`)
      }
      
      const evolutionData = await evolutionRes.json()
      const currentPokemonName = speciesData.name.toLowerCase()
      
      // Check if this Pokémon is the base form
      if (evolutionData.chain.species.name === currentPokemonName && evolutionData.chain.evolves_to.length > 0) {
        // Get the first evolution
        const evolvesToName = evolutionData.chain.evolves_to[0].species.name
        const evolvedRes = await fetch(`${POKEMON_API}/${evolvesToName}`)
        
        if (!evolvedRes.ok) {
          throw new Error(`Failed to fetch evolved Pokémon: ${evolvedRes.status}`)
        }
        
        const evolvedDetails = await evolvedRes.json()
        return {
          evolutionChain: {
            evolvesTo: {
              id: evolvedDetails.id,
              name: evolvedDetails.name,
              image: evolvedDetails.sprites.other["official-artwork"].front_default || 
                    evolvedDetails.sprites.front_default,
            },
          },
        }
      } 
      
      // Check if this is in the first evolution
      if (evolutionData.chain.evolves_to.length > 0) {
        const firstEvolution = evolutionData.chain.evolves_to.find(
          (e: any) => e.species.name === currentPokemonName,
        )

        if (firstEvolution && firstEvolution.evolves_to.length > 0) {
          // Get the second evolution
          const evolvesToName = firstEvolution.evolves_to[0].species.name
          const evolvedRes = await fetch(`${POKEMON_API}/${evolvesToName}`)
          
          if (!evolvedRes.ok) {
            throw new Error(`Failed to fetch evolved Pokémon: ${evolvedRes.status}`)
          }
          
          const evolvedDetails = await evolvedRes.json()
          return {
            evolutionChain: {
              evolvesTo: {
                id: evolvedDetails.id,
                name: evolvedDetails.name,
                image: evolvedDetails.sprites.other["official-artwork"].front_default || 
                      evolvedDetails.sprites.front_default,
              },
            },
          }
        }
      }
      
      return {}
    } catch (error) {
      console.error("Error fetching evolution data:", error)
      return {}
    }
  }, [])

  // Fetch Pokemon data with error handling and retries
  const fetchPokemon = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    const retryFetch = async (url: string, retries = 3): Promise<Response> => {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        return response
      } catch (error) {
        if (retries <= 0) throw error
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)))
        return retryFetch(url, retries - 1)
      }
    }
    
    try {
      const numberOfPairs = totalPairs.current
      // Use a varied offset to get different Pokémon each time
      const offset = Math.floor(Math.random() * 800) 
      
      const response = await retryFetch(`${POKEMON_API}?limit=${numberOfPairs}&offset=${offset}`)
      const data = await response.json()

      const pokemonPromises = data.results.map(async (p: { url: string }) => {
        const res = await retryFetch(p.url)
        const details = await res.json()
        
        // Fetch evolution data in parallel
        const evolutionData = await fetchEvolutionData(details.id)
        
        return {
          id: details.id,
          name: details.name,
          image: details.sprites.other["official-artwork"].front_default || 
                details.sprites.front_default,
          ...evolutionData, // Spread in any evolution data
        }
      })

      const pokemonDetails = await Promise.all(pokemonPromises)
      setPokemon(pokemonDetails)

      // Create pairs of cards
      const cardPairs = shuffleArray([
        ...pokemonDetails.map((p, idx) => ({ ...p, flipped: false, matched: false, id: idx })),
        ...pokemonDetails.map((p, idx) => ({ ...p, flipped: false, matched: false, id: idx + pokemonDetails.length }))
      ])

      setCards(cardPairs)
      setMatchedPairs(0)
      setConsecutiveMatches(0)
      aiMemory.current.clear()
      
    } catch (error) {
      console.error("Error fetching Pokemon:", error)
      setError("Failed to load Pokémon. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [fetchEvolutionData, shuffleArray])

  // Fetch cards when level changes
  useEffect(() => {
    fetchPokemon()
    
    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current)
        aiTimeoutRef.current = null
      }
    }
  }, [level, fetchPokemon])

  // Add entrance animation for cards
  useEffect(() => {
    if (!loading && boardRef.current) {
      const cards = boardRef.current.querySelectorAll(".card-container")
      
      gsap.fromTo(
        cards,
        {
          scale: 0.8,
          opacity: 0,
          y: 20,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          stagger: 0.03,
          duration: 0.5,
          ease: "back.out(1.7)",
          clearProps: "all", // Clean up after animation for better performance
        },
      )
    }
  }, [loading])

  // AI player logic with improved memory and strategy based on difficulty
  useEffect(() => {
    if (gameMode !== "ai" || currentPlayer !== aiPlayer || loading || disableFlip) {
      return
    }
    
    // Clear any existing timeout
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current)
    }
    
    aiTimeoutRef.current = setTimeout(() => {
      const unflippedCards = cards.filter(card => !card.flipped && !card.matched)
      
      // If no cards left to flip, return
      if (unflippedCards.length === 0) return
      
      let firstCardIndex = -1
      let secondCardIndex = -1
      
      // AI difficulty affects strategy
      const useMemory = aiDifficulty === "hard" || 
                        (aiDifficulty === "medium" && Math.random() > 0.2) || 
                        (aiDifficulty === "easy" && Math.random() > 0.7)
      
      if (useMemory) {
        // Check if we can make a match from memory
        for (const [cardName, positions] of aiMemory.current.entries()) {
          // Find unflipped positions for this card type
          const availablePositions = positions.filter(
            pos => !cards[pos].flipped && !cards[pos].matched
          )
          
          if (availablePositions.length >= 2) {
            // We have a match in memory!
            firstCardIndex = availablePositions[0]
            secondCardIndex = availablePositions[1]
            break
          }
        }
      }
      
      // If no match in memory or not using memory, try a different strategy
      if (firstCardIndex === -1) {
        // Pick a random card
        const randomIndex = Math.floor(Math.random() * unflippedCards.length)
        firstCardIndex = cards.findIndex(card => card.id === unflippedCards[randomIndex].id)
        
        // Flip first card
        handleCardFlip(firstCardIndex)
        
        // AI waits before flipping second card
        aiTimeoutRef.current = setTimeout(() => {
          // Check if we have the matching card in memory
          const firstCardName = cards[firstCardIndex].name
          const matchingPositions = aiMemory.current.get(firstCardName) || []
          
          // Filter out the first card's position and already matched/flipped cards
          const availableMatches = matchingPositions.filter(
            pos => pos !== firstCardIndex && !cards[pos].flipped && !cards[pos].matched
          )
          
          if (useMemory && availableMatches.length > 0) {
            // We know where the matching card is!
            secondCardIndex = availableMatches[0]
          } else {
            // Pick a random second card that's not the first one
            const remainingUnflipped = unflippedCards.filter(card => 
              cards.findIndex(c => c.id === card.id) !== firstCardIndex
            )
            
            if (remainingUnflipped.length > 0) {
              const randomSecondIndex = Math.floor(Math.random() * remainingUnflipped.length)
              secondCardIndex = cards.findIndex(card => card.id === remainingUnflipped[randomSecondIndex].id)
            }
          }
          
          // Flip second card if available
          if (secondCardIndex >= 0) {
            handleCardFlip(secondCardIndex)
          }
        }, 1000)
      } else {
        // We have a match in memory, flip both cards with a delay
        handleCardFlip(firstCardIndex)
        
        aiTimeoutRef.current = setTimeout(() => {
          handleCardFlip(secondCardIndex)
        }, 1000)
      }
    }, 1500)
    
    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current)
        aiTimeoutRef.current = null
      }
    }
  }, [currentPlayer, gameMode, aiPlayer, cards, loading, disableFlip, aiDifficulty, handleCardFlip])

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-12 h-12 text-yellow-300 animate-spin mb-4" />
        <p className="text-lg">Loading Pokémon...</p>
      </div>
    )
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
    )
  }

  return (
    <>
      <div
        ref={boardRef}
        className="bg-gradient-to-br from-indigo-800/30 to-purple-800/30 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-indigo-500/20"
      >
        <div className={`grid ${getGridColumns()} gap-3 md:gap-4`}>
          {cards.map((card, index) => (
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
  )
}