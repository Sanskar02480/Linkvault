import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import bookmarkRouter from './routes/bookmarks.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/bookmarks', bookmarkRouter)
app.get('/', (req, res) => res.send('Linkvault server is running ✅'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))