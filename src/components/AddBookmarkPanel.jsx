import { X, Link2, Tag, StickyNote } from "lucide-react"
import { useState } from "react"
import { saveBookmark } from "../api/bookmarks"
import { motion } from "framer-motion"

function AddBookmarkPanel({ isOpen, onClose }) {
  const [url, setUrl] = useState("")
  const [note, setNote] = useState("")
  const [tags, setTags] = useState("")

  async function handleSave() {
    if (!url.trim()) return
    try {
      await saveBookmark({
        url,
        note,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean)
      })
      setUrl("")
      setNote("")
      setTags("")
      onClose()
    } catch (error) {
      console.log("Save error:", error)
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white/80 backdrop-blur-xl z-50 shadow-2xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Save Bookmark</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <div className="px-6 py-6 flex flex-col gap-6">

          {/* URL */}
          <motion.div whileFocus={{ scale: 1.02 }} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">URL</label>
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition">
              <Link2 size={18} className="text-gray-400" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="w-full outline-none text-sm bg-transparent"
              />
            </div>
          </motion.div>

          {/* TAGS */}
          <motion.div whileFocus={{ scale: 1.02 }} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">Tags</label>
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition">
              <Tag size={18} className="text-gray-400" />
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="react, frontend, javascript"
                className="w-full outline-none text-sm bg-transparent"
              />
            </div>

            {/* TAG PREVIEW */}
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.split(",").map((tag, i) => tag.trim() && (
                <span key={i} className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          </motion.div>

          {/* NOTE */}
          <motion.div whileFocus={{ scale: 1.02 }} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">Note</label>
            <div className="flex gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-pink-400 focus-within:ring-2 focus-within:ring-pink-100 transition">
              <StickyNote size={18} className="text-gray-400 mt-1" />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Why are you saving this?"
                rows={3}
                className="w-full outline-none text-sm bg-transparent resize-none"
              />
            </div>
          </motion.div>

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition"
          >
            Save Bookmark
          </motion.button>
        </div>
      </div>
    </>
  )
}

export default AddBookmarkPanel
