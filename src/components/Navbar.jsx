import { Link } from "react-router-dom"
import { Bookmark } from "lucide-react"

function Navbar({ onAdd }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 
    bg-white/80 backdrop-blur-xl border-b border-gray-200 
    px-6 py-3 flex items-center justify-between">

      {/* LOGO */}
      <Link to="/" className="flex items-center gap-2 no-underline group">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-100 to-purple-100 
        flex items-center justify-center shadow-sm">
          <Bookmark className="text-orange-600 group-hover:scale-110 transition-transform" size={18} />
        </div>

        <span className="text-lg font-semibold text-gray-900 tracking-tight">
          LinkVault
        </span>
      </Link>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">

        <Link
          to="/bookmarks"
          className="text-sm text-gray-600 hover:text-gray-900 
          transition-colors font-medium"
        >
          My Bookmarks
        </Link>

        <button
          onClick={onAdd}
          className="text-sm bg-gradient-to-r from-orange-500 to-orange-600 
          text-white px-4 py-2 rounded-lg 
          shadow-md hover:shadow-lg hover:scale-[1.02] 
          transition-all duration-200 font-medium"
        >
          + Add Bookmark
        </button>

      </div>
    </nav>
  )
}

export default Navbar