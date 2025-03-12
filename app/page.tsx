import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { NameForm } from "@/components/name-form"
import { isToday } from "@/lib/utils"
import { getUser } from "@/lib/user"

export default async function HomePage() {
  const cookieStore = cookies()
  const userIdCookie = cookieStore.get("userId")

  if (userIdCookie) {
    const user = await getUser(userIdCookie.value)

    if (user) {
      // If user exists and hasn't answered today's question, redirect to question
      if (!user.lastAnswered || !isToday(new Date(user.lastAnswered))) {
        return redirect("/question")
      }

      // If user has already answered today's question, redirect to results
      return redirect("/results")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-950">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Daily Trivia Challenge</h1>
            <p className="text-gray-500 dark:text-gray-400">Answer one question per day and track your score!</p>
          </div>
          <NameForm />
        </div>
      </div>
    </div>
  )
}

