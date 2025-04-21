"use client"

import { CardFooter } from "@/components/ui/card"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search } from "lucide-react"

// Mock data for admin view
const mockResponseData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  firstname: ["John", "Jane", "Alex", "Sarah", "Michael"][Math.floor(Math.random() * 5)],
  lastname: ["Smith", "Johnson", "Williams", "Brown", "Jones"][Math.floor(Math.random() * 5)],
  test_type: ["human-only", "human-ai", "human-ai-explanation"][Math.floor(Math.random() * 3)],
  instance_id: Math.floor(Math.random() * 10) + 1,
  user_prediction: ["Sunny", "Cloudy", "Rainy", "Stormy"][Math.floor(Math.random() * 4)],
  model_prediction: ["Sunny", "Cloudy", "Rainy", "Stormy"][Math.floor(Math.random() * 4)],
  explanation: "Based on the input features, this weather pattern suggests this outcome.",
  timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
}))

const mockSurveyData = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  firstname: ["John", "Jane", "Alex", "Sarah", "Michael"][Math.floor(Math.random() * 5)],
  lastname: ["Smith", "Johnson", "Williams", "Brown", "Jones"][Math.floor(Math.random() * 5)],
  test_type: ["human-only", "human-ai", "human-ai-explanation"][Math.floor(Math.random() * 3)],
  answers: [
    { question_id: "confidence_human", value: String(Math.floor(Math.random() * 5) + 1) },
    { question_id: "confidence_ai", value: String(Math.floor(Math.random() * 5) + 1) },
    { question_id: "helpfulness", value: String(Math.floor(Math.random() * 5) + 1) },
  ],
  timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
}))

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("responses")
  const [filterType, setFilterType] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")

  const handleLogin = () => {
    // In a real app, you would validate against a secure backend
    // This is just for demo purposes
    if (password === "admin123") {
      setIsAuthenticated(true)
    }
  }

  const filteredResponses = mockResponseData.filter((response) => {
    const matchesType = filterType === "all" || response.test_type === filterType
    const matchesSearch =
      response.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.user_prediction.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesType && matchesSearch
  })

  const filteredSurveys = mockSurveyData.filter((survey) => {
    const matchesType = filterType === "all" || survey.test_type === filterType
    const matchesSearch =
      survey.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.lastname.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesType && matchesSearch
  })

  const exportCSV = (data: any[], type: string) => {
    // Convert data to CSV format
    let csv: string

    if (type === "responses") {
      const headers =
        "ID,First Name,Last Name,Test Type,Instance ID,User Prediction,Model Prediction,Explanation,Timestamp\n"
      const rows = data
        .map(
          (item) =>
            `${item.id},"${item.firstname}","${item.lastname}","${item.test_type}",${item.instance_id},"${item.user_prediction}","${item.model_prediction || ""}","${item.explanation || ""}","${item.timestamp}"`,
        )
        .join("\n")
      csv = headers + rows
    } else {
      const headers = "ID,First Name,Last Name,Test Type,Confidence (Human),Confidence (AI),Helpfulness,Timestamp\n"
      const rows = data
        .map((item) => {
          const confidenceHuman = item.answers.find((a) => a.question_id === "confidence_human")?.value || ""
          const confidenceAI = item.answers.find((a) => a.question_id === "confidence_ai")?.value || ""
          const helpfulness = item.answers.find((a) => a.question_id === "helpfulness")?.value || ""

          return `${item.id},"${item.firstname}","${item.lastname}","${item.test_type}","${confidenceHuman}","${confidenceAI}","${helpfulness}","${item.timestamp}"`
        })
        .join("\n")
      csv = headers + rows
    }

    // Create a download link
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${type}_export_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Please enter the admin password to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleLogin}>
              Login
            </Button>
          </CardFooter>
        </Card>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>View and manage experiment data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex w-full items-center space-x-2 md:w-auto">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="human-only">Human Only</SelectItem>
                  <SelectItem value="human-ai">Human + AI</SelectItem>
                  <SelectItem value="human-ai-explanation">Human + AI + Explanation</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => exportCSV(activeTab === "responses" ? filteredResponses : filteredSurveys, activeTab)}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="responses">Responses</TabsTrigger>
              <TabsTrigger value="surveys">Surveys</TabsTrigger>
            </TabsList>

            <TabsContent value="responses">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Test Type</TableHead>
                      <TableHead>Instance</TableHead>
                      <TableHead>User Prediction</TableHead>
                      <TableHead>AI Prediction</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResponses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No data found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredResponses.map((response) => (
                        <TableRow key={response.id}>
                          <TableCell>{response.id}</TableCell>
                          <TableCell>{`${response.firstname} ${response.lastname}`}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                response.test_type === "human-only"
                                  ? "bg-gray-100 text-gray-800"
                                  : response.test_type === "human-ai"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {response.test_type}
                            </span>
                          </TableCell>
                          <TableCell>{response.instance_id}</TableCell>
                          <TableCell>{response.user_prediction}</TableCell>
                          <TableCell>{response.model_prediction || "N/A"}</TableCell>
                          <TableCell>{new Date(response.timestamp).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="surveys">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Test Type</TableHead>
                      <TableHead>Confidence (Human)</TableHead>
                      <TableHead>Confidence (AI)</TableHead>
                      <TableHead>Helpfulness</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSurveys.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No data found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSurveys.map((survey) => {
                        const confidenceHuman =
                          survey.answers.find((a) => a.question_id === "confidence_human")?.value || "N/A"
                        const confidenceAI =
                          survey.answers.find((a) => a.question_id === "confidence_ai")?.value || "N/A"
                        const helpfulness = survey.answers.find((a) => a.question_id === "helpfulness")?.value || "N/A"

                        return (
                          <TableRow key={survey.id}>
                            <TableCell>{survey.id}</TableCell>
                            <TableCell>{`${survey.firstname} ${survey.lastname}`}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                  survey.test_type === "human-only"
                                    ? "bg-gray-100 text-gray-800"
                                    : survey.test_type === "human-ai"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-green-100 text-green-800"
                                }`}
                              >
                                {survey.test_type}
                              </span>
                            </TableCell>
                            <TableCell>{confidenceHuman}</TableCell>
                            <TableCell>{confidenceAI}</TableCell>
                            <TableCell>{helpfulness}</TableCell>
                            <TableCell>{new Date(survey.timestamp).toLocaleDateString()}</TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
