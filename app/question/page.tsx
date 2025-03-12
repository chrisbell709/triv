import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { QuestionForm } from "@/components/question-form"
import { getTodayQuestion } from "@/lib/questions"
import { getUser } from "@/lib/user"
import { isToday } from "@/lib/utils"

export default async function QuestionPage() {
  const cookieStore = cookies()
  const userIdCookie = cookieStore.get("userId")

  if (!userIdCookie) {
    return redirect("/")
  }

  const user = await getUser(userIdCookie.value)

  if (!user) {
    return redirect("/")
  }

  // If user has already answered today's question, redirect to results
  if (user.lastAnswered && isToday(new Date(user.lastAnswered))) {
    return redirect("/results")
  }

  const question = await getTodayQuestion()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-lg">
        <div className="space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-950">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Today's Question</h1>
              <div className="text-sm text-gray-500 dark:text-gray-400">Score: {user.score || 0}</div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Hi, {user.name}! Answer correctly to increase your score.
            </p>
          </div>

          <QuestionForm question={question} userId={user.id} />
        </div>
      </div>
    </div>
  )
}

