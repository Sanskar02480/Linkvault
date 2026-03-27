import { SearchX } from "lucide-react"

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center mt-20 text-center">
      <SearchX className="text-gray-300 mb-4" size={48} />
      <h3 className="text-lg font-semibold text-gray-500">No results found</h3>
      <p className="text-sm text-gray-400 mt-1">
        Try searching with different words or save more bookmarks
      </p>
    </div>
  )
}

export default EmptyState