import { useState } from "react"
import Navbar from "../components/Navbar"
import SearchBar from "../components/SearchBar"
import { mockBookmarks } from "../data/mockBookmarks"
import BookmarkCard from "../components/BookmarkCard"

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  function handleSearch() {
    if (!searchQuery.trim()) return
    const filtered = mockBookmarks.filter(
      (b) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setResults(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAdd={() => setIsPanelOpen(true)} />
      <div className="pt-28 flex flex-col items-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Find anything you saved
        </h1>
        <p className="text-gray-400 mb-10 text-base">
          Semantic search powered by AI — search by idea, not exact words
        </p>
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
        />
     {results !== null && results.length > 0 && (
  <div className="w-full max-w-2xl mt-8 flex flex-col gap-4">
    {results.map((bookmark) => (
      <BookmarkCard key={bookmark.id} bookmark={bookmark} />
    ))}
  </div>
)}

{results !== null && results.length === 0 && (
  <p className="text-gray-400 mt-10">No results found. Try different words.</p>
)}
      </div>
    </div>
  )
}

export default HomePage