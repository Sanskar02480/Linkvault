import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import BookmarkCard from "../components/BookmarkCard"
import AddBookmarkPanel from "../components/AddBookmarkPanel"
import { getAllBookmarks } from "../api/bookmarks"
import { motion, AnimatePresence } from "framer-motion"

function ResultsPage() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  // 🔔 TOAST STATE
  const [showToast, setShowToast] = useState(false)

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

  // 🔥 NEW BOOKMARK HANDLER
  function handleNewBookmark(newBookmark) {
    setBookmarks((prev) => [newBookmark, ...prev])

    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <Navbar onAdd={() => setIsPanelOpen(true)} />

      {/* 🔔 TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] 
            bg-white border border-gray-200 shadow-xl rounded-xl px-5 py-3"
          >
            <p className="text-sm font-medium text-gray-800">
              ✅ Bookmark saved successfully
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-24 px-6 max-w-5xl mx-auto">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Bookmarks</h1>
          {!loading && (
            <p className="text-sm text-gray-400 mt-1">
              {bookmarks.length} saved link{bookmarks.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && bookmarks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-12">
            {bookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark._id} bookmark={bookmark} />
            ))}
          </div>
        )}
      </div>

      <AddBookmarkPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSaved={handleNewBookmark} // 🔥 CONNECTED
      />
    </div>
  )
}

export default ResultsPage