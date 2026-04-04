import { Search } from "lucide-react"

function SearchBar({ value, onChange, onSearch }) {
  function handleKeyDown(e) {
    if (e.key === "Enter") onSearch()
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-gray-400" size={20} />
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Search by meaning, not just keywords..."
          className="w-full pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base border border-gray-200 rounded-2xl bg-white shadow-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
        />
      </div>
      <p className="text-xs sm:text-sm text-gray-400 text-center mt-3">
        Try searching — "how React renders" or "MongoDB performance"
      </p>
    </div>
  )
}

export default SearchBar