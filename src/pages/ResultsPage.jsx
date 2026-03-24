import Navbar from "../components/Navbar"

function ResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAdd={() => console.log("add clicked")} />
      <div className="pt-20 px-6">
        <h1 className="text-2xl font-bold text-gray-900">All Bookmarks</h1>
      </div>
    </div>
  )
}

export default ResultsPage