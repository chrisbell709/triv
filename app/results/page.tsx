import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { getUser } from "@/lib/user"
import { getTodayQuestion } from "@/lib/questions"
import { getUserAnswer } from "@/lib/answers"
import { isToday } from "@/lib/utils"
import Link from "next/link"

export default async function ResultsPage() {
  const cookieStore = cookies()
  const userIdCookie = cookieStore.get("userId")

  if (!userIdCookie) {
    return redirect("/")
  }

  const user = await getUser(userIdCookie.value)

  if (!user) {
    return redirect("/")
  }

  // If user hasn't answered today's question yet, redirect to question
  if (!user.lastAnswered || !isToday(new Date(user.lastAnswered))) {
    return redirect("/question")
  }

  const question = await getTodayQuestion()
  const userAnswer = await getUserAnswer(user.id, question.id)
  const isCorrect = userAnswer === question.correctAnswer

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-lg">
        <div className="space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-950">
          <div className="space-y-3 text-center">
            <h1 className="text-2xl font-bold">Today's Results</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {user.name}, your current score is {user.score}
            </p>

            <div
              className={`p-4 rounded-lg ${isCorrect ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}
            >
              <p className="font-medium">{isCorrect ? "🎉 Correct!" : "❌ Incorrect!"}</p>
              <div className="mt-2">
                <p className="text-sm">
                  <span className="font-medium">Question:</span> {question.text}
                </p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Your answer:</span> {userAnswer}
                </p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Correct answer:</span> {question.correctAnswer}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-center text-gray-500 dark:text-gray-400">Come back tomorrow for a new question!</p>

            <div className="flex justify-center">
              <Link href="/leaderboard">
                <Button variant="outline">View Leaderboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

