"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Home() {
  const router = useRouter()
  const [testType, setTestType] = useState<string>("")
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [isFormValid, setIsFormValid] = useState<boolean>(false)

  useEffect(() => {
    setIsFormValid(firstName.trim() !== "" && lastName.trim() !== "" && testType !== "")
  }, [firstName, lastName, testType])

  const handleSubmit = () => {
    // Store user info and test type in session storage
    sessionStorage.setItem("firstName", firstName)
    sessionStorage.setItem("lastName", lastName)
    sessionStorage.setItem("testType", testType)

    // Navigate to pre-task page
    router.push("/pre-task")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>AI Experiment</CardTitle>
          <CardDescription>Please select a test type and enter your information to begin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="test-type">Test Type</Label>
            <Select value={testType} onValueChange={setTestType}>
              <SelectTrigger id="test-type">
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="human-only">A. Human-only</SelectItem>
                <SelectItem value="human-ai">B. Human + AI Prediction</SelectItem>
                <SelectItem value="human-ai-explanation">C. Human + AI + Explanation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input
              id="first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              id="last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit} disabled={!isFormValid}>
            Begin Experiment
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
