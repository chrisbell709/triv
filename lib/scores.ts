import redis from "./redis"
import { type User, getUser } from "./user"

// Get top scoring users
export async function getTopScores(limit = 10): Promise<User[]> {
  // Get all user IDs
  const userIds = await redis.smembers("users")

  // Get all users
  const userPromises = userIds.map((id) => getUser(id))
  const users = await Promise.all(userPromises)

  // Filter out null values and sort by score
  return users
    .filter((user): user is User => user !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

