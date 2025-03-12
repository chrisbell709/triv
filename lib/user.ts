import redis from "./redis"

export interface User {
  id: string
  name: string
  score: number
  lastAnswered?: string
  createdAt: string
}

// Create a new user
export async function createUser(user: User): Promise<void> {
  await redis.hset(`user:${user.id}`, user)
  // Add user to users set for querying all users
  await redis.sadd("users", user.id)
}

// Get user by ID
export async function getUser(userId: string): Promise<User | null> {
  const user = await redis.hgetall(`user:${userId}`)
  return Object.keys(user).length > 0 ? (user as unknown as User) : null
}

// Update user's score and last answered timestamp
export async function updateUserScore(userId: string, newScore: number): Promise<void> {
  await redis.hset(`user:${userId}`, {
    score: newScore,
    lastAnswered: new Date().toISOString(),
  })
}

// Update only the lastAnswered timestamp (for incorrect answers)
export async function updateUserLastAnswered(userId: string): Promise<void> {
  await redis.hset(`user:${userId}`, {
    lastAnswered: new Date().toISOString(),
  })
}

