import { useEffect, useState, useRef } from "react"
import Navbar from "../components/Navbar"
import BookmarkCard from "../components/BookmarkCard"
import AddBookmarkPanel from "../components/AddBookmarkPanel"
import { getAllBookmarks, deleteBookmark } from "../api/bookmarks"
import { motion, AnimatePresence } from "framer-motion"
import { MoreVertical, Trash2 } from "lucide-react"

function BookmarkCardWrapper({ bookmark, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteBookmark(bookmark._id)
      onDelete(bookmark._id)
    } catch (e) {
      console.log(e)
      setDeleting(false)
    }
  }

  return (
    <div className="relative">
      <BookmarkCard bookmark={bookmark} />
      <div ref={menuRef} className="absolute top-3 sm:top-4 right-9 sm:right-10 z-10">
        <button
          onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen) }}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <MoreVertical size={15} className="text-gray-400" />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-xl w-32 sm:w-36 overflow-hidden z-20"
            >
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ResultsPage() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

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

  function showToastMessage(msg) {
    setToastMsg(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  function handleNewBookmark(newBookmark) {
    setBookmarks((prev) => [newBookmark, ...prev])
    showToastMessage("✅ Bookmark saved successfully")
  }

  function handleDelete(id) {
    setBookmarks((prev) => prev.filter((b) => b._id !== id))
    showToastMessage("🗑️ Bookmark deleted")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <Navbar onAdd={() => setIsPanelOpen(true)} />

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-white border border-gray-200 shadow-xl rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 whitespace-nowrap"
          >
            <p className="text-sm font-medium text-gray-800">{toastMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-20 sm:pt-24 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="mb-5 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Bookmarks</h1>
          {!loading && (
            <p className="text-sm text-gray-400 mt-1">
              {bookmarks.length} saved link{bookmarks.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                  <div className="h-3 bg-gray-100 rounded w-24" />
                </div>
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {!loading && bookmarks.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 sm:mt-24 text-center px-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-purple-100 flex items-center justify-center mb-4 text-2xl">
              🔖
            </div>
            <p className="text-base sm:text-lg font-semibold text-gray-700 mb-1">No bookmarks yet</p>
            <p className="text-sm text-gray-400 mb-6">Save your first link and it will appear here.</p>
            <button
              onClick={() => setIsPanelOpen(true)}
              className="px-5 py-2.5 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition"
            >
              Add your first bookmark
            </button>
          </div>
        )}

        {!loading && bookmarks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-12">
            {bookmarks.map((bookmark) => (
              <BookmarkCardWrapper
                key={bookmark._id}
                bookmark={bookmark}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <AddBookmarkPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSaved={handleNewBookmark}
      />
    </div>
  )
}

export default ResultsPage