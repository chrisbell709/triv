export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: string
}

// This is a simple static implementation. In a real app, you might fetch
// questions from an API or a database with a different question each day.
const questions: Question[] = [
  {
    id: "q1",
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
  {
    id: "q2",
    text: "What is the capital of Japan?",
    options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
    correctAnswer: "Tokyo",
  },
  {
    id: "q3",
    text: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci",
  },
  {
    id: "q4",
    text: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Iron", "Osmium"],
    correctAnswer: "Oxygen",
  },
  {
    id: "q5",
    text: "What is the largest mammal on Earth?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: "Blue Whale",
  },
]

// Get today's question based on the date
export async function getTodayQuestion(): Promise<Question> {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  const questionIndex = dayOfYear % questions.length
  return questions[questionIndex]
}

