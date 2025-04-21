"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Survey questions based on test type
const surveyQuestions = {
  "human-only": [
    {
      id: "confidence_human",
      question: "How confident are you in the final predictions you made?",
      options: [
        { value: "1", label: "Not at all confident" },
        { value: "2", label: "Slightly confident" },
        { value: "3", label: "Moderately confident" },
        { value: "4", label: "Very confident" },
        { value: "5", label: "Extremely confident" },
      ],
    },
  ],
  "human-ai": [
    {
      id: "confidence_human",
      question: "How confident are you in the final predictions you made?",
      options: [
        { value: "1", label: "Not at all confident" },
        { value: "2", label: "Slightly confident" },
        { value: "3", label: "Moderately confident" },
        { value: "4", label: "Very confident" },
        { value: "5", label: "Extremely confident" },
      ],
    },
    {
      id: "confidence_ai",
      question: "How confident are you in the AI predictions?",
      options: [
        { value: "1", label: "Not at all confident" },
        { value: "2", label: "Slightly confident" },
        { value: "3", label: "Moderately confident" },
        { value: "4", label: "Very confident" },
        { value: "5", label: "Extremely confident" },
      ],
    },
    {
      id: "helpfulness",
      question: "How helpful was the model prediction in making the final prediction?",
      options: [
        { value: "1", label: "Not at all helpful" },
        { value: "2", label: "Slightly helpful" },
        { value: "3", label: "Moderately helpful" },
        { value: "4", label: "Very helpful" },
        { value: "5", label: "Extremely helpful" },
      ],
    },
  ],
  "human-ai-explanation": [
    {
      id: "confidence_human",
      question: "How confident are you in the final predictions you made?",
      options: [
        { value: "1", label: "Not at all confident" },
        { value: "2", label: "Slightly confident" },
        { value: "3", label: "Moderately confident" },
        { value: "4", label: "Very confident" },
        { value: "5", label: "Extremely confident" },
      ],
    },
    {
      id: "confidence_ai",
      question: "How confident are you in the AI predictions?",
      options: [
        { value: "1", label: "Not at all confident" },
        { value: "2", label: "Slightly confident" },
        { value: "3", label: "Moderately confident" },
        { value: "4", label: "Very confident" },
        { value: "5", label: "Extremely confident" },
      ],
    },
    {
      id: "helpfulness_prediction",
      question: "How helpful was the model prediction in making the final prediction?",
      options: [
        { value: "1", label: "Not at all helpful" },
        { value: "2", label: "Slightly helpful" },
        { value: "3", label: "Moderately helpful" },
        { value: "4", label: "Very helpful" },
        { value: "5", label: "Extremely helpful" },
      ],
    },
    {
      id: "helpfulness_explanation",
      question: "How helpful was the explanation in making the final prediction?",
      options: [
        { value: "1", label: "Not at all helpful" },
        { value: "2", label: "Slightly helpful" },
        { value: "3", label: "Moderately helpful" },
        { value: "4", label: "Very helpful" },
        { value: "5", label: "Extremely helpful" },
      ],
    },
  ],
}

export default function Survey() {
  const router = useRouter()
  const [testType, setTestType] = useState<string>("")
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)

  useEffect(() => {
    // Retrieve user info and test type from session storage
    const storedTestType = sessionStorage.getItem("testType")
    const storedFirstName = sessionStorage.getItem("firstName")
    const storedLastName = sessionStorage.getItem("lastName")

    if (!storedTestType || !storedFirstName || !storedLastName) {
      router.push("/")
      return
    }

    setTestType(storedTestType)
    setFirstName(storedFirstName)
    setLastName(storedLastName)
    setLoading(false)
  }, [router])

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    })
  }

  const isFormComplete = () => {
    const questions = surveyQuestions[testType as keyof typeof surveyQuestions] || []
    return questions.every((q) => answers[q.id])
  }

  const handleSubmit = async () => {
    if (!isFormComplete()) {
      return
    }

    setSubmitting(true)

    try {
      // Prepare survey data
      const surveyData = {
        firstname: firstName,
        lastname: lastName,
        test_type: testType,
        answers: Object.entries(answers).map(([questionId, value]) => ({
          question_id: questionId,
          value,
        })),
        timestamp: new Date().toISOString(),
      }

      // In a real app, you would send this to your API
      // await fetch('/api/survey', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(surveyData)
      // });

      // For demo purposes, we'll just log it
      console.log("Submitted survey:", surveyData)

      setSubmitted(true)

      // Clear session storage
      setTimeout(() => {
        sessionStorage.clear()
        router.push("/thank-you")
      }, 2000)
    } catch (err) {
      console.error("Error submitting survey:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  const questions = surveyQuestions[testType as keyof typeof surveyQuestions] || []

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Survey</CardTitle>
          <CardDescription>Please answer the following questions about your experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {submitted ? (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Thank you!</AlertTitle>
              <AlertDescription>Your survey has been submitted successfully.</AlertDescription>
            </Alert>
          ) : (
            questions.map((question) => (
              <div key={question.id} className="space-y-3">
                <h3 className="font-medium">{question.question}</h3>
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                >
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                      <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit} disabled={submitting || submitted || !isFormComplete()}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>Submit Survey</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
