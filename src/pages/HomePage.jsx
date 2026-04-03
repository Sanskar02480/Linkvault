import { useState, useEffect, useRef } from "react"
import Navbar from "../components/Navbar"
import SearchBar from "../components/SearchBar"
import BookmarkCard from "../components/BookmarkCard"
import EmptyState from "../components/EmptyState"
import AddBookmarkPanel from "../components/AddBookmarkPanel"
import { vectorSearch, getAllBookmarks } from "../api/bookmarks"
import { Search, Link, Tag, Zap, ArrowLeft, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const features = [
  {
    icon: Link,
    title: "Paste. Done.",
    description: "Drop any URL and LinkVault fetches the title, description, and metadata automatically. Zero manual effort.",
    badge: "Auto-scraping"
  },
  {
    icon: Search,
    title: "Search like you think",
    description: "Forget exact titles. Search 'that React article about hooks' and find it instantly. AI understands intent.",
    badge: "Semantic AI"
  },
  {
    icon: Tag,
    title: "Tags that actually work",
    description: "Add comma-separated tags on save. Filter and browse your entire library in seconds.",
    badge: "Organized"
  },
  {
    icon: Zap,
    title: "Built on real AI",
    description: "Powered by OpenAI embeddings and MongoDB Atlas Vector Search — the same tech used in production AI systems.",
    badge: "RAG Architecture"
  }
]

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [allBookmarks, setAllBookmarks] = useState([])
  const debounceRef = useRef(null)

  useEffect(() => {
    async function fetchAll() {
      try {
        const res = await getAllBookmarks()
        setAllBookmarks(res.data)
      } catch (e) {
        console.log(e)
      }
    }
    fetchAll()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const q = searchQuery.toLowerCase()
      const matched = allBookmarks
        .filter(b =>
          b.title?.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q) ||
          b.tags?.some(t => t.toLowerCase().includes(q))
        )
        .slice(0, 4)
      setSuggestions(matched)
      setShowSuggestions(matched.length > 0)
    }, 300)
  }, [searchQuery, allBookmarks])

  async function handleSearch() {
    if (!searchQuery.trim()) return
    setShowSuggestions(false)
    try {
      const response = await vectorSearch(searchQuery)
      setResults(response.data)
    } catch (error) {
      console.log("Search error:", error)
      setResults([])
    }
  }

  function handleSuggestionClick(bookmark) {
    setSearchQuery(bookmark.title || bookmark.url)
    setShowSuggestions(false)
    setResults([bookmark])
  }

  function handleClear() {
    setSearchQuery("")
    setResults(null)
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <Navbar onAdd={() => setIsPanelOpen(true)} />

      <div className="pt-28 flex flex-col items-center px-4 text-center">

        {results !== null && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleClear}
            className="self-start ml-4 mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to home
          </motion.button>
        )}

        {results === null && (
          <>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-gray-900 mb-4"
            >
              Your Second Brain for the Internet
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 mb-8 max-w-xl"
            >
              Save, organize, and rediscover anything with AI-powered semantic search.
            </motion.p>
          </>
        )}

        <div className="w-full max-w-2xl relative">
          <div className="backdrop-blur-xl bg-white/70 border border-gray-200 shadow-xl rounded-2xl p-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search by meaning, not just keywords..."
                className="w-full pl-12 pr-10 py-4 text-base bg-transparent focus:outline-none text-gray-800 placeholder-gray-400"
              />
              {searchQuery && (
                <button onClick={handleClear} className="absolute right-4 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>
            {!showSuggestions && (
              <p className="text-xs text-gray-400 text-center pb-2">
                Try searching — "how React renders" or "MongoDB performance"
              </p>
            )}
          </div>

          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden"
              >
                {suggestions.map((bookmark) => (
                  <button
                    key={bookmark._id}
                    onClick={() => handleSuggestionClick(bookmark)}
                    className="w-full text-left px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <p className="text-sm font-medium text-gray-800 truncate">{bookmark.title || bookmark.url}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{bookmark.url}</p>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {results !== null && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-3xl mx-auto mt-8 grid gap-4"
          >
            <p className="text-sm text-gray-400 text-left">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
            {results.map((bookmark) => (
              <motion.div key={bookmark._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <BookmarkCard bookmark={bookmark} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {results !== null && results.length === 0 && <EmptyState />}

        {results === null && (
          <>
            {/* FEATURES */}
            <div className="max-w-6xl mx-auto mt-20 px-4 w-full">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center mb-10">
  Why LinkVault
</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
  {features.map((feature, i) => {
    const Icon = feature.icon
    return (
      <motion.div
  key={feature.title}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: i * 0.1 }}
  whileHover={{ y: -6 }}
  className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl px-6 py-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-start text-left relative overflow-hidden"
>
  <span className="absolute top-4 right-4 text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">
    {feature.badge}
  </span>

  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-purple-100 flex items-center justify-center mb-5 shadow-sm">
    <Icon size={22} className="text-orange-600" />
  </div>

  <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
    {feature.title}
  </h3>

  <p className="text-sm text-gray-500 leading-relaxed">
    {feature.description}
  </p>
</motion.div>
      
     
    )
  })}
</div>
            </div>

            {/* HOW IT WORKS */}
            <div className="max-w-5xl mx-auto mt-24 px-4 text-center w-full">
              <h2 className="text-2xl font-semibold mb-10 text-gray-800">How it works</h2>

              <div className="grid sm:grid-cols-3 gap-8">
                {[
  {
    title: "Save any link",
    desc: "Paste a URL — title and description are scraped automatically in the background.",
    detail: "No forms. No friction."
  },
  {
    title: "Tag and organize",
    desc: "Add tags like 'react, performance' when saving. Your library stays clean from day one.",
    detail: "Comma separated, zero effort."
  },
  {
    title: "Find it instantly",
    desc: "Search by idea months later. AI matches meaning, not just words.",
    detail: "Powered by vector search."
  }
].map((step, i) => (
  <motion.div
    key={i}
    whileHover={{ scale: 1.03 }}
    className="p-6 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition text-left relative overflow-hidden"
  >
    <div className="text-3xl font-black text-gray-100 absolute top-4 right-5 select-none">
      0{i + 1}
    </div>
    <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center mb-4">
      <span className="text-white font-bold text-sm">0{i + 1}</span>
    </div>
    <p className="text-gray-900 font-bold text-base mb-1">{step.title}</p>
    <p className="text-sm text-gray-500 mb-3 leading-relaxed">{step.desc}</p>
    <span className="text-xs font-semibold text-purple-500 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full">
      {step.detail}
    </span>
  </motion.div>
))}
              </div>
            </div>

         <div className="mt-20 mb-16 text-center">
  <p className="text-gray-400 text-sm mb-4">Ready to stop losing links?</p>
  <button
    onClick={() => setIsPanelOpen(true)}
    className="px-8 py-3.5 bg-orange-500 text-white font-semibold rounded-xl shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all duration-200 text-sm"
  >
    Save your first bookmark →
  </button>
</div>
          </>
        )}
      </div>

      <AddBookmarkPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  )
}

export default HomePage