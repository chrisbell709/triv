import { type NextRequest, NextResponse } from "next/server"
import { getUser, updateUserLastAnswered, updateUserScore } from "@/lib/user"
import { getTodayQuestion } from "@/lib/questions"
import { saveUserAnswer } from "@/lib/answers"

export async function POST(request: NextRequest) {
  try {
    const { userId, questionId, answer } = await request.json()

    if (!userId || !questionId || !answer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await getUser(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const question = await getTodayQuestion()
    if (question.id !== questionId) {
      return NextResponse.json({ error: "Invalid question ID" }, { status: 400 })
    }

    // Save user's answer
    await saveUserAnswer(userId, questionId, answer)

    // Update user's score if the answer is correct
    if (answer === question.correctAnswer) {
      await updateUserScore(userId, (user.score || 0) + 1)
    } else {
      // Even if the answer is incorrect, update lastAnswered to prevent retries
      await updateUserLastAnswered(userId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing answer:", error)
    return NextResponse.json({ error: "Failed to process answer" }, { status: 500 })
  }
}

