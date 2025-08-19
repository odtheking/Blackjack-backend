import {Card, GameState, Rank, Status, Suit} from '../types/types'

export function generateDeck(): Card[] {
    const suits: Suit[] = Object.values(Suit)
    const ranks: Rank[] = Object.values(Rank)
    const deck: Card[] = []

    for (const suit of suits)
        for (const rank of ranks)
            deck.push({ suit: suit, rank: rank })

    return deck
}

export const shuffle = (deck: Card[]): Card[] => deck.sort(() => Math.random() - 0.5)

export function dealInitialCards(deck: Card[]) {
    return { deck: deck.slice(4), playerCards: [deck[0], deck[2]], dealerCards: [deck[1], deck[3]] }
}

export function drawCard(deck: Card[]): { card: Card, deck: Card[] } {
    const [card, ...rest] = deck
    return { card: card, deck: rest }
}

export function calculateScore(hand: Card[]): { score: number, altScore?: number } {
    let score = 0
    let aces = 0

    for (const { rank } of hand) {
        if (rank === Rank.Ace) {
            score += 11
            aces++
        } else if ([Rank.Jack, Rank.Queen, Rank.King].includes(rank)) score += 10
        else score += parseInt(rank)
    }

    while (score > 21 && aces > 0) {
        score -= 10
        aces--
    }

    const altScore = (aces > 0 ? score - 10 : undefined)

    return { score, altScore }
}


export function playerHit(gameState: GameState): GameState {
    const newState = { ...gameState }

    const { card, deck } = drawCard(newState.deck)
    const playerCards = [...newState.playerHand.cards, card]
    const { score, altScore } = calculateScore(playerCards)

    newState.playerHand = { cards: playerCards, score, altScore}
    newState.deck = deck

    if (score > 21) newState.gameStatus = Status.Lose
    else if (score === 21) return playerStands(newState)

    return newState
}

export const playerStands = (gameState: GameState): GameState => {
    let newState = { ...gameState }
    newState = playDealer(newState)

    if      (newState.dealerHand.score > 21)                         newState.gameStatus = Status.Win
    else if (newState.dealerHand.score > newState.playerHand.score)  newState.gameStatus = Status.Lose
    else if (newState.dealerHand.score < newState.playerHand.score)  newState.gameStatus = Status.Win
    else                                                             newState.gameStatus = Status.Push

    return newState
}

function playDealer(gameState: GameState): GameState {
    const newState = { ...gameState }
    let dealerHand = { ...newState.dealerHand }

    while (dealerHand.score < 17) {
        const { card, deck } = drawCard(newState.deck)
        const dealerCards = [...dealerHand.cards, card]
        const { score, altScore } = calculateScore(dealerCards)

        dealerHand = {cards: dealerCards, score, altScore}

        newState.dealerHand = dealerHand
        newState.deck = deck
    }

    return newState
}

export function playerDouble(gameState: GameState): GameState {
    const newState = playerHit(gameState)

    if (newState.gameStatus === Status.Lose) return newState

    return playerStands(newState)
}