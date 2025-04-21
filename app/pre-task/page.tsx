"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

// Mock data for pre-task examples
const mockExamples = [
  {
    id: 1,
    features: {
      temperature: 75,
      humidity: 65,
      pressure: 1012,
      windSpeed: 10,
      cloudCover: 30,
    },
    prediction: "Sunny",
    explanation:
      "The combination of moderate temperature, low humidity, and minimal cloud cover suggests sunny conditions.",
  },
  {
    id: 2,
    features: {
      temperature: 68,
      humidity: 85,
      pressure: 1008,
      windSpeed: 15,
      cloudCover: 70,
    },
    prediction: "Cloudy",
    explanation: "High humidity and significant cloud cover indicate cloudy conditions, despite moderate temperature.",
  },
  {
    id: 3,
    features: {
      temperature: 62,
      humidity: 90,
      pressure: 1000,
      windSpeed: 20,
      cloudCover: 90,
    },
    prediction: "Rainy",
    explanation:
      "The combination of high humidity, low pressure, and extensive cloud cover strongly suggests rainy conditions.",
  },
]

export default function PreTask() {
  const router = useRouter()
  const [testType, setTestType] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<string>("1")

  useEffect(() => {
    // Retrieve test type from session storage
    const storedTestType = sessionStorage.getItem("testType")
    if (!storedTestType) {
      router.push("/")
      return
    }

    setTestType(storedTestType)
    setLoading(false)
  }, [router])

  const handleContinue = () => {
    router.push("/main-task")
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
          <CardTitle>Pre-Task Examples</CardTitle>
          <CardDescription>
            Review these examples to understand the task. You will be asked to make predictions based on similar data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="1" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="1">Example 1</TabsTrigger>
              <TabsTrigger value="2">Example 2</TabsTrigger>
              <TabsTrigger value="3">Example 3</TabsTrigger>
            </TabsList>

            {mockExamples.map((example, index) => (
              <TabsContent key={example.id} value={(index + 1).toString()} className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="mb-2 font-medium">Input Features:</h3>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {Object.entries(example.features).map(([key, value]) => (
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
                    <p className="text-blue-700">{example.prediction}</p>
                  </div>
                )}

                {testType === "human-ai-explanation" && (
                  <div className="rounded-md border border-green-200 bg-green-50 p-4">
                    <h3 className="mb-2 font-medium text-green-700">Explanation:</h3>
                    <p className="text-green-700">{example.explanation}</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              const newTabIndex = Math.max(1, Number.parseInt(activeTab) - 1)
              setActiveTab(newTabIndex.toString())
            }}
            disabled={activeTab === "1"}
          >
            Previous
          </Button>

          {activeTab === "3" ? (
            <Button onClick={handleContinue}>Continue to Main Task</Button>
          ) : (
            <Button
              onClick={() => {
                const newTabIndex = Math.min(3, Number.parseInt(activeTab) + 1)
                setActiveTab(newTabIndex.toString())
              }}
            >
              Next Example
            </Button>
          )}
        </CardFooter>
      </Card>
    </main>
  )
}
