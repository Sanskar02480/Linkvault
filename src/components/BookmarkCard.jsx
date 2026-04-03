import { ExternalLink } from "lucide-react"

function BookmarkCard({ bookmark }) {
  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 
      shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-orange-200 
      transition-all duration-300 group"
    >
      <div className="flex items-start justify-between gap-4">
        
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-purple-100 
          flex items-center justify-center flex-shrink-0 shadow-sm">
            <img
              src={`https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=32`}
              alt=""
              className="w-5 h-5"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>

          <p className="text-xs text-purple-500 font-semibold truncate">
            {(() => { 
              try { return new URL(bookmark.url).hostname } 
              catch { return bookmark.url } 
            })()}
          </p>
        </div>

        <ExternalLink
          size={16}
          className="text-gray-300 group-hover:text-orange-500 
          transition-colors flex-shrink-0 mt-1"
        />
      </div>

      <h2 className="text-base font-semibold text-gray-900 mt-3 leading-snug line-clamp-2 
      group-hover:text-orange-600 transition-colors">
        {bookmark.title || bookmark.url}
      </h2>

      {bookmark.description && (
        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
          {bookmark.description}
        </p>
      )}

      {bookmark.tags && bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {bookmark.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-orange-50 text-orange-600 border border-orange-100 
              px-3 py-1 rounded-full font-medium hover:bg-orange-100 transition"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {bookmark.score && (
        <div className="mt-4 flex items-center gap-2">
          <div className="h-1.5 w-20 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-purple-500 rounded-full"
              style={{ width: `${Math.round(bookmark.score * 100)}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {Math.round(bookmark.score * 100)}% match
          </span>
        </div>
      )}
    </a>
  )
}

export default BookmarkCard