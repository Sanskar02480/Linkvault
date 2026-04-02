import { X } from "lucide-react"
import { useState } from "react"
import { saveBookmark } from "../api/bookmarks"

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
      alert("Bookmark saved!")
    } catch (error) {
      console.log("Save error:", error)
      alert("Something went wrong. Try again.")
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Save a Bookmark</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="react, frontend, javascript"
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Why are you saving this?"
              rows={4}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Save Bookmark
          </button>
        </div>
      </div>
    </>
  )
}

export default AddBookmarkPanel