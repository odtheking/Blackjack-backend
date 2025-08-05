import {Card, Rank, Suit, GameState, Status} from '../types/types'

export function generateDeck(): Card[] {
    const suits: Suit[] = Object.values(Suit)
    const ranks: Rank[] = Object.values(Rank)
    const deck: Card[] = []

    for (const suit of suits)
        for (const rank of ranks)
            deck.push({ suit, rank })

    return deck
}

export const shuffle = (deck: Card[]): Card[] => deck.sort(() => Math.random() - 0.5)

export function dealInitialCards(deck: Card[]): {
    deck: Card[]
    playerCards: Card[]
    dealerCards: Card[]
} {
    const playerHand = [deck[0], deck[2]]
    const dealerHand = [deck[1], deck[3]]

    return { deck: deck.slice(4), playerCards: playerHand, dealerCards: dealerHand }
}

export function drawCard(deck: Card[]): { card: Card; deck: Card[] } {
    const [card, ...rest] = deck
    return { card, deck: rest }
}

export function calculateScore(hand: Card[]): { score: number, altScore?: number } {
    let score = 0
    let aces = 0

    for (const { rank } of hand) {
        if (rank === Rank.Ace) {
            aces++
            score += 11
        } else if ([Rank.Jack, Rank.Queen, Rank.King].includes(rank)) score += 10
        else score += parseInt(rank)
    }

    let altScore = score
    while (altScore > 21 && aces-- > 0) altScore -= 10

    return altScore < score && altScore <= 21 ? { score: altScore, altScore: score } : { score: altScore }
}

export const playerHit = (gameState: GameState): GameState => {
    const { card, deck } = drawCard(gameState.deck)
    const playerHand = gameState.playerHand
    playerHand.cards.push(card)

    const { score, altScore } = calculateScore(playerHand.cards)
    playerHand.score = score
    playerHand.altScore = altScore ?? score

    if (altScore ?? score > 21) gameState.gameStatus = Status.Lose

    gameState.deck = deck

    return gameState
}

export const playerStands = (gameState: GameState): GameState => {
    playDealer(gameState)

    if      (gameState.dealerHand.score > 21)                         gameState.gameStatus = Status.Win
    else if (gameState.dealerHand.score > gameState.playerHand.score) gameState.gameStatus = Status.Lose
    else if (gameState.dealerHand.score < gameState.playerHand.score) gameState.gameStatus = Status.Win
    else                                                              gameState.gameStatus = Status.Push

    return gameState
}

const playDealer = (gameState: GameState): GameState => {
    const dealerHand = gameState.dealerHand
    while (dealerHand.score < 17) {
        const { card, deck } = drawCard(gameState.deck)
        dealerHand.cards.push(card)

        const { score, altScore } = calculateScore(dealerHand.cards)
        dealerHand.score = score
        dealerHand.altScore = altScore ?? score

        gameState.deck = deck
    }

    return gameState
}