import express from 'express'
import {generateDeck, shuffle, dealInitialCards, calculateScore, playerHit, playerStands} from '../logic/blackjack'
import {GameState, Status} from '../types/types'

const router = express.Router()

let gameState: GameState

router.post('/start', (req, res) => {
    const { playerCards, dealerCards, deck: remainingDeck } = dealInitialCards(shuffle(generateDeck()))

    const { score: playerScore, altScore: playerAltScore } = calculateScore(playerCards)
    const { score: dealerScore, altScore: dealerAltScore } = calculateScore(dealerCards)

    const playerHand = { cards: playerCards, score: playerScore, altScore: playerAltScore ?? playerScore }
    const dealerHand = { cards: dealerCards, score: dealerScore, altScore: dealerAltScore ?? dealerScore }

    gameState = { deck: remainingDeck, playerHand: playerHand, dealerHand: dealerHand, gameStatus: Status.InProgress }

    res.json(gameState)
})

router.post('/hit', (req, res) => {
    if (!gameState || gameState.gameStatus != Status.InProgress)
        return res.status(400).json({ error: "No game in progress" })

    console.log("hit  game state:", gameState)
    gameState = playerHit(gameState)

    res.json(gameState)
})

router.post('/stand', (req, res) => {
    if (!gameState || gameState.gameStatus != Status.InProgress)
        return res.status(400).json({ error: "No game in progress" })

    console.log("stands game state:", gameState)
    gameState = playerStands(gameState)

    res.json(gameState)
})

export default router