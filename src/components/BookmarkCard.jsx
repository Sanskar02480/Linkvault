function BookmarkCard({ bookmark }) {
  return (
      <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-colors"
    >
      <h2 className="text-base font-semibold text-gray-900">{bookmark.title}</h2>
      <p className="text-sm text-purple-500 mt-1">{new URL(bookmark.url).hostname}</p>
      <p className="text-sm text-gray-500 mt-2">{bookmark.description}</p>

      <div className="flex flex-wrap gap-2 mt-3">
        {bookmark.tags.map((tag) => (
          <span key={tag} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <span className="text-xs text-green-600 font-medium mt-3 block">
        {Math.round(bookmark.score * 100)}% match
      </span>
    </a>
  )
}

export default BookmarkCard