import Game from "../components/Game"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-indigo-500/[0.05] bg-[size:20px_20px]" />
      </div>
      <Game />
    </main>
  )
}

