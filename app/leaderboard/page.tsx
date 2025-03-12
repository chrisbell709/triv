import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getTopScores } from "@/lib/scores"

export default async function LeaderboardPage() {
  const leaderboard = await getTopScores(10)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-lg">
        <div className="space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-950">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Leaderboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Top trivia champions</p>
          </div>

          <div className="rounded-lg border">
            <div className="grid grid-cols-3 gap-4 border-b p-4 font-medium">
              <div>Rank</div>
              <div>Name</div>
              <div className="text-right">Score</div>
            </div>

            {leaderboard.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No scores yet. Be the first to play!
              </div>
            ) : (
              <div className="divide-y">
                {leaderboard.map((user, index) => (
                  <div key={user.id} className="grid grid-cols-3 gap-4 p-4">
                    <div>{index + 1}</div>
                    <div>{user.name}</div>
                    <div className="text-right font-medium">{user.score}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

