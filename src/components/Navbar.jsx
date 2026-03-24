import { Link } from "react-router-dom"
import { Bookmark } from "lucide-react"

function Navbar({ onAdd }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      
      <div className="flex items-center gap-2">
        <Bookmark className="text-purple-600" size={22} />
        <span className="text-xl font-semibold text-gray-900">LinkVault</span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/bookmarks"
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          My Bookmarks
        </Link>
        <button
          onClick={onAdd}
          className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          + Add Bookmark
        </button>
      </div>

    </nav>
  )
}

export default Navbar