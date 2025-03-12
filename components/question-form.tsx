"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Question } from "@/lib/questions"

interface QuestionFormProps {
  question: Question
  userId: string
}

export function QuestionForm({ question, userId }: QuestionFormProps) {
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAnswer) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          questionId: question.id,
          answer: selectedAnswer,
        }),
      })

      if (response.ok) {
        router.push("/results")
        router.refresh()
      } else {
        throw new Error("Failed to submit answer")
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-medium">{question.text}</h2>

        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
          {question.options.map((option, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full" disabled={!selectedAnswer || isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Answer"}
      </Button>
    </form>
  )
}

