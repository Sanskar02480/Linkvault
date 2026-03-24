import Navbar from "../components/Navbar"

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAdd={() => console.log("add clicked")} />
      <div className="pt-20 flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to LinkVault</h1>
        <p className="text-gray-500 mt-2">Your semantic bookmark manager</p>
      </div>
    </div>
  )
}

export default HomePage