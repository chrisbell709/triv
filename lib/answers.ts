import redis from "./redis"

// Save user's answer to a question
export async function saveUserAnswer(userId: string, questionId: string, answer: string): Promise<void> {
  await redis.hset(`answer:${userId}:${questionId}`, {
    userId,
    questionId,
    answer,
    answeredAt: new Date().toISOString(),
  })
}

// Get user's answer to a specific question
export async function getUserAnswer(userId: string, questionId: string): Promise<string | null> {
  const answer = await redis.hget(`answer:${userId}:${questionId}`, "answer")
  return answer
}

