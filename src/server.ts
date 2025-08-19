import express from 'express'
import cors from 'cors'
import gameRouter from './routes/game'

const app = express()

const PORT = 5555
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})

app.use(cors())
app.use('/game', gameRouter)