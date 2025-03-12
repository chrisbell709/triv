import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"
import { createUser } from "@/lib/user"

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const userId = nanoid()

    // Create user in Redis
    await createUser({
      id: userId,
      name: name.trim(),
      score: 0,
      createdAt: new Date().toISOString(),
    })

    // Set cookie
    cookies().set({
      name: "userId",
      value: userId,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

