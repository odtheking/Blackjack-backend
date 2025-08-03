import express from 'express'
import { generateDeck, shuffle, dealInitialCards } from '../logic/blackjack'

const router = express.Router()

router.post('/start', (req, res) => {
    const { playerHand, dealerHand, deck: remainingDeck } = dealInitialCards(shuffle(generateDeck()))

    res.json({ deck: remainingDeck, playerHand, dealerHand, gameOver: false })
})

export default router