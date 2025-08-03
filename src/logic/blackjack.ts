import { Card, Rank, Suit, GameState } from '../types/types'

export function generateDeck(): Card[] {
    const suits: Suit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
    const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
    const deck: Card[] = []

    for (const suit of suits)
        for (const rank of ranks)
            deck.push({ suit, rank })

    return deck
}

export const shuffle = (deck: Card[]): Card[] => deck.sort(() => Math.random() - 0.5)

export function dealInitialCards(deck: Card[]): {
    deck: Card[]
    playerHand: Card[]
    dealerHand: Card[]
} {
    const playerHand = [deck[0], deck[2]]
    const dealerHand = [deck[1], deck[3]]

    return { deck: deck.slice(4), playerHand, dealerHand }
}

export function drawCard(deck: Card[]): { card: Card; deck: Card[] } {
    const [card, ...rest] = deck
    return { card, deck: rest }
}

export function calculateScore(hand: Card[]): number {
    let score = 0
    let aces = 0

    for (const card of hand) {
        if (card.rank === 'A') {
            aces++
            score += 11
        } else if (['K', 'Q', 'J'].includes(card.rank)) score += 10
        else score += parseInt(card.rank)
    }

    while (score > 21 && aces > 0) {
        score -= 10
        aces--
    }

    return score
}

export function isBusted(hand: Card[]): boolean {
    return calculateScore(hand) > 21
}