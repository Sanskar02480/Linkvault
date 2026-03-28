import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import BookmarkCard from "../components/BookmarkCard"
import { getAllBookmarks } from "../api/bookmarks"


function ResultsPage() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const response = await getAllBookmarks()
        setBookmarks(response.data)
      } catch (error) {
        console.log("Fetch error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBookmarks()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAdd={() => setIsPanelOpen(true)} />
      <div className="pt-28 px-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookmarks</h1>

        {loading && (
          <p className="text-gray-400 text-sm">Loading...</p>
        )}

        {!loading && bookmarks.length === 0 && (
          <p className="text-gray-400 text-sm">No bookmarks saved yet.</p>
        )}

        {!loading && bookmarks.length > 0 && (
          <div className="flex flex-col gap-4">
            {bookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark._id} bookmark={bookmark} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultsPage