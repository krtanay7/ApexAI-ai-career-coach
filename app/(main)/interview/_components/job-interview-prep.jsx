"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { generateJobSpecificQuestions } from "@/actions/interview";
import { Sparkles, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function JobInterviewPrep() {
  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleGenerateQuestions = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description or leave it blank for general questions");
      return;
    }

    setLoading(true);
    try {
      const generatedQuestions = await generateJobSpecificQuestions(jobDescription);
      setQuestions(generatedQuestions);
      toast.success("Interview questions generated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate interview questions");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-300 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-blue-900">
            💼 Job-Specific Interview Preparation
          </CardTitle>
          <p className="text-sm text-blue-800 mt-2">
            Generate targeted interview questions based on your job description and skills. Leave blank for general preparation questions.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800">Job Description (Optional)</label>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here to get tailored interview questions... Or leave empty for general questions based on your skills."
              className="h-32 border-2 border-gray-400 bg-white text-gray-900 font-medium"
            />
            <p className="text-xs text-gray-600 font-medium">
              💡 Tip: Include job title, required skills, and key responsibilities for better questions
            </p>
          </div>
          
          <Button
            onClick={handleGenerateQuestions}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base border-2 border-blue-600"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                🎯 Generate Interview Questions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold gradient-title">
            📋 Your Interview Questions ({questions.length})
          </h2>
          
          {questions.map((question, index) => (
            <Card
              key={index}
              className={`border-l-4 ${
                question.type === "technical"
                  ? "border-l-purple-500 bg-purple-50"
                  : "border-l-green-500 bg-green-50"
              }`}
            >
              <CardHeader
                className="cursor-pointer hover:bg-opacity-80"
                onClick={() => toggleExpand(index)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          question.type === "technical"
                            ? "bg-purple-200 text-purple-900"
                            : "bg-green-200 text-green-900"
                        }`}
                      >
                        {question.type === "technical" ? "🔧 Technical" : "💬 Behavioral"}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {index + 1}. {question.question}
                    </CardTitle>
                  </div>
                  {expandedIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-600 mt-1" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600 mt-1" />
                  )}
                </div>
              </CardHeader>

              {expandedIndex === index && (
                <CardContent className="space-y-4 border-t-2 border-gray-200 pt-4">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">📌 Why this question?</h4>
                    <p className="text-sm text-gray-700 bg-white p-3 rounded border-l-4 border-blue-500">
                      {question.context}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">✅ Suggested Answer Structure</h4>
                    <p className="text-sm text-gray-700 bg-white p-3 rounded">
                      {question.suggestedAnswer}
                    </p>
                  </div>

                  {question.tips && question.tips.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">💡 Tips for Answering</h4>
                      <ul className="space-y-2">
                        {question.tips.map((tip, tipIndex) => (
                          <li
                            key={tipIndex}
                            className="flex gap-2 text-sm text-gray-700 bg-blue-50 p-2 rounded border-l-2 border-blue-500"
                          >
                            <span className="font-bold">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}

          <Card className="border-2 border-gray-300 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900">
                📝 Interview Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <span className="text-xl">1️⃣</span>
                <div>
                  <h4 className="font-bold text-gray-800">Prepare Stories (STAR Method)</h4>
                  <p className="text-sm text-gray-700">
                    For behavioral questions, use Situation, Task, Action, Result format
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">2️⃣</span>
                <div>
                  <h4 className="font-bold text-gray-800">Research the Company</h4>
                  <p className="text-sm text-gray-700">
                    Know their products, culture, and recent news
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">3️⃣</span>
                <div>
                  <h4 className="font-bold text-gray-800">Practice Out Loud</h4>
                  <p className="text-sm text-gray-700">
                    Record yourself or practice with a friend to improve clarity
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">4️⃣</span>
                <div>
                  <h4 className="font-bold text-gray-800">Ask Good Questions</h4>
                  <p className="text-sm text-gray-700">
                    Show genuine interest by asking about team, projects, and company direction
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {questions.length === 0 && !loading && (
        <Card className="border-2 border-gray-300 bg-gray-50 text-center py-12">
          <Sparkles className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Generate Your First Set of Questions
          </h3>
          <p className="text-sm text-gray-600">
            Enter a job description or click generate to get started with your interview prep!
          </p>
        </Card>
      )}
    </div>
  );
}
