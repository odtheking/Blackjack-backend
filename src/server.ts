import express from 'express'
import gameRouter from './routes/game'

const app = express()

const PORT = 5555
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`)
})

app.use('/game', gameRouter)