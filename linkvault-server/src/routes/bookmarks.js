import express from 'express'
import Bookmark from '../models/Bookmark.js'
import scrapeUrl from '../utils/scraper.js'
import generateEmbedding from '../utils/embeddings.js'

const router = express.Router()

// GET all bookmarks
router.get('/', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find().sort({ createdAt: -1 })
    res.json(bookmarks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST save a new bookmark


router.post('/', async (req, res) => {
  try {
    const { url, note, tags } = req.body
    if (!url) return res.status(400).json({ message: "URL is required" })

    const { title, description } = await scrapeUrl(url)
    const text = `${title} ${description}.trim()`
    const embedding = await generateEmbedding(text)
    const bookmark = new Bookmark({
      url,
      title,
      description,
      tags,
      note,
      embedding
    })

    await bookmark.save()
    res.status(201).json(bookmark)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/vector-search' ,async (req , res) => {
  try{
    const {q} =req.query
    if(!q) return res.status(400).json({message: "Query is required"})
    
    const queryEmbedding = await generateEmbedding(q)

    if (!queryEmbedding || queryEmbedding.length === 0) {
      const bookmarks = await Bookmark.find({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { tags: { $regex: q, $options: 'i' } }
        ]
      })
      return res.json(bookmarks)
    }
    const bookmarks = await Bookmark.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 50,
          limit: 10
        }
      },
      {
        $addFields: {
          score: { $meta: "vectorSearchScore" }
        }
      }
    ])

    res.json(bookmarks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query
    if (!q) return res.status(400).json({ message: "Query is required" })

    const bookmarks = await Bookmark.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    })

    res.json(bookmarks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router