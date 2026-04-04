# LinkVault — AI-Powered Bookmark Manager

> Stop losing saved links. Search by meaning, not exact words.

LinkVault is a full-stack intelligent bookmark manager built with a RAG (Retrieval-Augmented Generation) architecture. Paste any URL — the app auto-scrapes the title and description, generates vector embeddings using OpenAI, and stores them in MongoDB Atlas for semantic search.

## Live Demo
https://linkvault-self.vercel.app/

## Preview
<img width="1911" height="949" alt="Image" src="https://github.com/user-attachments/assets/e8b3b755-b37a-4d0a-a37e-83d07745594e" />
<img width="1898" height="963" alt="Image" src="https://github.com/user-attachments/assets/48a93ac9-fedb-46a6-96fb-9cd660a382e2" />
<img width="1919" height="966" alt="Image" src="https://github.com/user-attachments/assets/b28ea0fa-a1aa-4ba2-9126-6f97791ae69d" />
<img width="1900" height="973" alt="Image" src="https://github.com/user-attachments/assets/1812f5ee-2a73-45a2-bb0c-7daca6619fb8" />

## The Problem
You save 50 links a week. Three weeks later you remember "there was an article about React hooks optimization" but can't find it because you don't remember the exact title or URL.

## The Solution
LinkVault converts every saved bookmark into a vector embedding — a mathematical representation of its meaning. When you search, your query is also embedded and MongoDB finds bookmarks that are semantically close, even if zero words match.

## Tech Stack

** Frontend
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Axios

** Backend
- Node.js + Express
- MongoDB Atlas + Mongoose
- MongoDB Atlas Vector Search
- OpenAI text-embedding-3-small
- Cheerio (web scraper)
- dotenv, cors

## Architecture
User pastes URL
↓
Cheerio scrapes title + description
↓
OpenAI generates 1536-dim embedding
↓
Stored in MongoDB with vector index
↓
Search query → embed → cosine similarity → results


### Ingestion Pipeline
1. User saves a URL via the frontend panel
2. Express POST route receives the URL
3. Cheerio fetches the page and extracts `<title>` and `<meta description>`
4. Combined text sent to `text-embedding-3-small` API
5. Returns 1536 float values representing semantic meaning
6. Bookmark + embedding stored in MongoDB

### Retrieval Pipeline
1. User types a search query
2. Query embedded using same OpenAI model
3. MongoDB `$vectorSearch` aggregation runs cosine similarity
4. Top-k semantically closest bookmarks returned
5. Falls back to keyword regex search if embeddings unavailable

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- OpenAI API key (optional — falls back to keyword search)

### Backend Setup
```bash
cd linkvault-server
npm install
```

### Frontend Setup
```bash
cd linkvault
npm install
npm run dev
```

Both servers: from `linkvault-server` run `npm run both`

## Note on Vector Search
The app is architected for full semantic search. With an OpenAI API key added, every saved bookmark generates a 1536-dimensional embedding stored in a MongoDB Atlas Vector Search index. Without credits, it gracefully falls back to keyword search — all functionality works either way.
