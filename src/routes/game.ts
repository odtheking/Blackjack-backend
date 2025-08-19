import express from 'express'
import { generateDeck, shuffle, dealInitialCards, calculateScore, playerHit, playerStands, playerDouble } from '../logic/blackjack'
import {Card, GameState, Status} from '../types/types'

const router = express.Router()

let gameState: GameState

router.post('/start', (_, res) => {
    const { playerCards, dealerCards, deck: remainingDeck } = dealInitialCards(shuffle(generateDeck()))

    const { score: playerScore, altScore: playerAltScore } = calculateScore(playerCards)
    const { score: dealerScore, altScore: dealerAltScore } = calculateScore([dealerCards[0]])

    const playerHand = { cards: playerCards, score: playerScore, altScore: playerAltScore }
    const dealerHand = { cards: dealerCards, score: dealerScore, altScore: dealerAltScore }

    let gameStatus = Status.InProgress

    if (playerScore === 21 && playerCards.length === 2) {
        if (calculateScore(dealerCards).score === 21 && dealerCards.length === 2) gameStatus = Status.Push
        else gameStatus = Status.Blackjack
    }

    gameState = { deck: remainingDeck, playerHand, dealerHand, gameStatus }

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

router.post('/double', (req, res) => {
    if (!gameState || gameState.gameStatus !== Status.InProgress)
        return res.status(400).json({ error: "No game in progress" })

    gameState = playerDouble(gameState)
    console.log("double game state:", gameState)

    res.json(gameState)
})

export default router