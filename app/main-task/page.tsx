"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock data for main task
const mockTaskData = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  features: {
    temperature: Math.floor(Math.random() * 30) + 60,
    humidity: Math.floor(Math.random() * 50) + 50,
    pressure: Math.floor(Math.random() * 30) + 990,
    windSpeed: Math.floor(Math.random() * 25) + 5,
    cloudCover: Math.floor(Math.random() * 100),
  },
  prediction: ["Sunny", "Cloudy", "Rainy", "Stormy"][Math.floor(Math.random() * 4)],
  explanation: [
    "High temperature and low humidity suggest sunny conditions.",
    "Moderate temperature with high cloud cover indicates cloudy weather.",
    "High humidity and low pressure suggest rainy conditions.",
    "Low pressure, high wind speed, and high cloud cover indicate stormy weather.",
  ][Math.floor(Math.random() * 4)],
}))

export default function MainTask() {
  const router = useRouter()
  const [testType, setTestType] = useState<string>("")
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0)
  const [userPrediction, setUserPrediction] = useState<string>("")
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [responses, setResponses] = useState<
    Array<{
      instanceId: number
      userPrediction: string
      modelPrediction?: string
      explanation?: string
    }>
  >([])

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

  const currentTask = mockTaskData[currentTaskIndex]
  const progress = (currentTaskIndex / mockTaskData.length) * 100

  const handleSubmit = async () => {
    if (!userPrediction.trim()) {
      setError("Please enter your prediction")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // Prepare response data
      const responseData = {
        firstname: firstName,
        lastname: lastName,
        test_type: testType,
        instance_id: currentTask.id,
        user_prediction: userPrediction,
        ...(testType !== "human-only" && { model_prediction: currentTask.prediction }),
        ...(testType === "human-ai-explanation" && { explanation: currentTask.explanation }),
        timestamp: new Date().toISOString(),
      }

      // In a real app, you would send this to your API
      // await fetch('/api/response', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(responseData)
      // });

      // For demo purposes, we'll just log it and store in state
      console.log("Submitted response:", responseData)

      // Store response
      setResponses([
        ...responses,
        {
          instanceId: currentTask.id,
          userPrediction,
          ...(testType !== "human-only" && { modelPrediction: currentTask.prediction }),
          ...(testType === "human-ai-explanation" && { explanation: currentTask.explanation }),
        },
      ])

      // Show success message briefly
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)

        // Move to next task or survey
        if (currentTaskIndex < mockTaskData.length - 1) {
          setCurrentTaskIndex(currentTaskIndex + 1)
          setUserPrediction("")
        } else {
          // Store all responses in session storage for the survey
          sessionStorage.setItem("responses", JSON.stringify(responses))
          router.push("/survey")
        }
      }, 1000)
    } catch (err) {
      setError("Failed to submit response. Please try again.")
      console.error("Error submitting response:", err)
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Main Task</CardTitle>
            <Badge variant="outline">
              {currentTaskIndex + 1} of {mockTaskData.length}
            </Badge>
          </div>
          <CardDescription>Make a prediction based on the provided features.</CardDescription>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Your prediction has been recorded.</AlertDescription>
            </Alert>
          )}

          <div className="rounded-md border p-4">
            <h3 className="mb-2 font-medium">Input Features:</h3>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {currentTask &&
                Object.entries(currentTask.features).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between rounded-md bg-gray-100 p-2">
                    <span className="text-sm font-medium capitalize">{key}:</span>
                    <Badge variant="outline">{value}</Badge>
                  </div>
                ))}
            </div>
          </div>

          {(testType === "human-ai" || testType === "human-ai-explanation") && (
            <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
              <h3 className="mb-2 font-medium text-blue-700">AI Prediction:</h3>
              <p className="text-blue-700">{currentTask.prediction}</p>
            </div>
          )}

          {testType === "human-ai-explanation" && (
            <div className="rounded-md border border-green-200 bg-green-50 p-4">
              <h3 className="mb-2 font-medium text-green-700">Explanation:</h3>
              <p className="text-green-700">{currentTask.explanation}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="user-prediction">What is your prediction?</Label>
            <Input
              id="user-prediction"
              value={userPrediction}
              onChange={(e) => setUserPrediction(e.target.value)}
              placeholder="Enter your prediction"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>Submit Prediction</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
