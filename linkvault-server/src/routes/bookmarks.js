import express from 'express'
import Bookmark from '../models/Bookmark.js'
import scrapeUrl from '../utils/scraper.js'
import generateEmbedding from '../utils/embeddings.js'

const router = express.Router()

// GET all bookmarks — only return this user's bookmarks
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query
    if (!userId) return res.status(400).json({ message: "userId is required" })

    const bookmarks = await Bookmark.find({ userId }).sort({ createdAt: -1 })
    res.json(bookmarks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST save a new bookmark — attach userId to it
router.post('/', async (req, res) => {
  try {
    const { url, note, tags, userId } = req.body
    if (!url) return res.status(400).json({ message: "URL is required" })
    if (!userId) return res.status(400).json({ message: "userId is required" })

    const { title, description } = await scrapeUrl(url)
    const text = `${title} ${description}`.trim()
    const embedding = await generateEmbedding(text)

    const bookmark = new Bookmark({
      userId,   // NEW
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

// Vector search — scoped to userId
router.get('/vector-search', async (req, res) => {
  try {
    const { q, userId } = req.query
    if (!q) return res.status(400).json({ message: "Query is required" })
    if (!userId) return res.status(400).json({ message: "userId is required" })

    const queryEmbedding = await generateEmbedding(q)

    if (!queryEmbedding || queryEmbedding.length === 0) {
      const bookmarks = await Bookmark.find({
        userId,   // scoped
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
        // Filter to only this user's results after vector search
        $match: { userId }
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

// DELETE — only allow deleting own bookmarks
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.query
    if (!userId) return res.status(400).json({ message: "userId is required" })

    const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, userId })
    if (!bookmark) return res.status(404).json({ message: "Bookmark not found or not yours" })

    res.json({ message: "Bookmark deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Text search — scoped to userId
router.get('/search', async (req, res) => {
  try {
    const { q, userId } = req.query
    if (!q) return res.status(400).json({ message: "Query is required" })
    if (!userId) return res.status(400).json({ message: "userId is required" })

    const bookmarks = await Bookmark.find({
      userId,   // scoped
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