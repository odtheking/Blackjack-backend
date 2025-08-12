import express from 'express'
import {generateDeck, shuffle, dealInitialCards, calculateScore, playerHit, playerStands} from '../logic/blackjack'
import {Card, GameState, Status} from '../types/types'

const router = express.Router()

let gameState: GameState

router.post('/start', (req, res) => {
    const { playerCards, dealerCards, deck: remainingDeck } = dealInitialCards(shuffle(generateDeck()))

    const { score: playerScore, altScore: playerAltScore } = calculateScore(playerCards)
    const { score: dealerScore, altScore: dealerAltScore } = calculateScore(dealerCards.slice(1, 2))

    const playerHand = { cards: playerCards, score: playerScore, altScore: playerAltScore }
    const dealerHand = { cards: dealerCards, score: dealerScore, altScore: dealerAltScore }

    gameState = { deck: remainingDeck, playerHand: playerHand, dealerHand: dealerHand, gameStatus: Status.InProgress }

    res.json(gameState)
})

router.post('/hit', (req, res) => {
    if (!gameState || gameState.gameStatus != Status.InProgress)
        return res.status(400).json({ error: "No game in progress" })

    gameState = playerHit(gameState)
    console.log("hit game state:", gameState)

    res.json(gameState)
})

router.post('/stand', (req, res) => {
    if (!gameState || gameState.gameStatus != Status.InProgress)
        return res.status(400).json({ error: "No game in progress" })

    gameState = playerStands(gameState)
    console.log("stands game state:", gameState)

    res.json(gameState)
})

const card1: Card = { suit: 'Clubs', rank: '4' }
const card2: Card = { suit: 'Spades', rank: 'A' }
console.log(calculateScore([card1, card2]))

export default router