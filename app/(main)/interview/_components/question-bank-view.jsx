"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Heart,
  Check,
  Filter,
  Download,
  Eye,
  BarChart3,
  FileText,
} from "lucide-react";
import { toggleFavoriteQuestion, markQuestionProgress, getQuestionsByCompanyForExport } from "@/actions/interview-questions";
import { toast } from "sonner";

const COMPANIES = ["Google", "Amazon", "Microsoft", "Facebook", "Apple", "LinkedIn", "Meta"];
const CATEGORIES = ["DSA", "System Design", "Behavioral", "Database", "SQL", "DevOps"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function QuestionBankView({ initialQuestions = [], stats = {} }) {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Filter questions
  const filtered = useMemo(() => {
    return initialQuestions.filter(q => {
      const companyMatch = !selectedCompany || q.company === selectedCompany;
      const categoryMatch = !selectedCategory || q.category === selectedCategory;
      const difficultyMatch = !selectedDifficulty || q.difficulty === selectedDifficulty;
      const searchMatch = !searchQuery || q.question.toLowerCase().includes(searchQuery.toLowerCase());
      return companyMatch && categoryMatch && difficultyMatch && searchMatch;
    });
  }, [initialQuestions, selectedCompany, selectedCategory, selectedDifficulty, searchQuery]);

  const handleFavorite = async (questionId) => {
    try {
      await toggleFavoriteQuestion(questionId);
      setFavorites(prev => {
        const updated = new Set(prev);
        if (updated.has(questionId)) {
          updated.delete(questionId);
        } else {
          updated.add(questionId);
        }
        return updated;
      });
      toast.success("Favorite toggled!");
    } catch (error) {
      toast.error("Failed to update favorite");
    }
  };

  const handleMarkProgress = async (questionId, status) => {
    try {
      await markQuestionProgress(questionId, status);
      setUserProgress(prev => ({
        ...prev,
        [questionId]: status,
      }));
      toast.success(`Marked as ${status}!`);
    } catch (error) {
      toast.error("Failed to update progress");
    }
  };

  const handleExportPDF = async (company) => {
    try {
      toast.loading("Generating PDF...");
      const questionsToExport = await getQuestionsByCompanyForExport(company);
      
      if (questionsToExport.length === 0) {
        toast.error("No questions found for export");
        return;
      }

      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${company} Interview Questions</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background: white;
              }
              .page { page-break-after: always; padding: 40px; }
              .header {
                text-align: center;
                margin-bottom: 40px;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 20px;
              }
              .header h1 {
                color: #1e40af;
                font-size: 28px;
                margin-bottom: 10px;
              }
              .header p {
                color: #666;
                font-size: 14px;
              }
              .stats {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 20px;
                margin: 30px 0;
              }
              .stat { text-align: center; padding: 15px; background: #f3f4f6; border-radius: 8px; }
              .stat-value { font-size: 24px; font-weight: bold; color: #2563eb; }
              .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
              .question {
                margin: 25px 0;
                padding: 15px;
                border-left: 4px solid #2563eb;
                background: #f9fafb;
                break-inside: avoid;
              }
              .q-num { color: #2563eb; font-weight: bold; margin-bottom: 8px; }
              .q-text { font-size: 14px; font-weight: 600; margin-bottom: 10px; }
              .q-meta { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
              .badge {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
              }
              .badge-easy { background: #dcfce7; color: #166534; }
              .badge-medium { background: #fef3c7; color: #92400e; }
              .badge-hard { background: #fee2e2; color: #991b1b; }
              .badge-cat { background: #dbeafe; color: #1e40af; }
              .answer { margin-top: 10px; }
              .answer-label { font-weight: 600; color: #059669; margin-bottom: 4px; }
              .answer-text { font-size: 13px; color: #374151; margin-left: 10px; }
              .explain-label { font-weight: 600; color: #7c3aed; margin: 8px 0 4px 0; }
              .explain-text { font-size: 13px; color: #374151; margin-left: 10px; }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                font-size: 11px;
                color: #999;
              }
              @media print {
                body { background: white; }
                .question { break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            <div class="page">
              <div class="header">
                <h1>Interview Question Bank</h1>
                <p>${company} - Most Asked Interview Questions</p>
                <p>Generated: ${new Date().toLocaleDateString()}</p>
              </div>

              <div class="stats">
                <div class="stat">
                  <div class="stat-value">${questionsToExport.length}</div>
                  <div class="stat-label">Total Questions</div>
                </div>
                <div class="stat">
                  <div class="stat-value">${questionsToExport.filter(q => q.difficulty === "Easy").length}</div>
                  <div class="stat-label">Easy</div>
                </div>
                <div class="stat">
                  <div class="stat-value">${questionsToExport.filter(q => q.difficulty === "Medium").length}</div>
                  <div class="stat-label">Medium</div>
                </div>
                <div class="stat">
                  <div class="stat-value">${questionsToExport.filter(q => q.difficulty === "Hard").length}</div>
                  <div class="stat-label">Hard</div>
                </div>
              </div>

              ${questionsToExport
                .map(
                  (q, idx) => `
                <div class="question">
                  <div class="q-num">Q${idx + 1}</div>
                  <div class="q-text">${q.question}</div>
                  <div class="q-meta">
                    <span class="badge badge-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
                    <span class="badge badge-cat">${q.category}</span>
                    ${q.frequency ? `<span class="badge badge-cat">${q.frequency}x</span>` : ""}
                  </div>
                  <div class="answer">
                    <div class="answer-label">✓ Answer:</div>
                    <div class="answer-text">${q.answer}</div>
                  </div>
                  ${q.explanation ? `<div class="answer"><div class="explain-label">💡 Explanation:</div><div class="explain-text">${q.explanation}</div></div>` : ""}
                </div>
              `
                )
                .join("")}

              <div class="footer">
                <p>This is a confidential interview preparation document.</p>
                <p>© AI Career Coach - Interview Preparation</p>
              </div>
            </div>
          </body>
        </html>
      `;

      // Open print dialog
      const printWindow = window.open("", "", "width=800,height=600");
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
      
      toast.success(`PDF ready for ${company}!`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg p-6 border">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Total Questions
            </h3>
            <div className="text-3xl font-bold text-purple-600">{stats.total || 0}</div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Mastered
            </h3>
            <div className="text-3xl font-bold text-green-600">{stats.mastered || 0}</div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Attempted
            </h3>
            <div className="text-3xl font-bold text-blue-600">{stats.attempted || 0}</div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Favorites
            </h3>
            <div className="text-3xl font-bold text-pink-600">{stats.favorites || 0}</div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Completion %
            </h3>
            <div className="text-3xl font-bold text-indigo-600">
              {stats.total > 0 ? Math.round(((stats.mastered + stats.attempted) / stats.total) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
        />
      </div>

      {/* Company Filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium flex items-center gap-1">
          <Filter className="h-4 w-4" />
          Companies:
        </span>
        <Button
          variant={selectedCompany === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCompany(null)}
        >
          All Companies
        </Button>
        {COMPANIES.map(company => (
          <Button
            key={company}
            variant={selectedCompany === company ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCompany(company)}
          >
            {company}
          </Button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium">Categories:</span>
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All Categories
        </Button>
        {CATEGORIES.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Difficulty Filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium">Difficulty:</span>
        <Button
          variant={selectedDifficulty === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDifficulty(null)}
        >
          All Levels
        </Button>
        {DIFFICULTIES.map(difficulty => (
          <Button
            key={difficulty}
            variant={selectedDifficulty === difficulty ? "default" : "outline"}
            size="sm"
            className={selectedDifficulty === difficulty ? getDifficultyColor(difficulty) : ""}
            onClick={() => setSelectedDifficulty(difficulty)}
          >
            {difficulty}
          </Button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Questions ({filtered.length})
          </h3>
          {selectedCompany && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportPDF(selectedCompany)}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          )}
        </div>

        {filtered.length > 0 ? (
          filtered.map((question, idx) => {
            const isFavorited = favorites.has(question.id);
            const progress = userProgress[question.id];

            return (
              <Card key={question.id || idx} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        <h4 className="text-lg font-semibold flex-1">{question.question}</h4>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                        <Badge variant="outline">{question.category}</Badge>
                        <Badge variant="outline">{question.company}</Badge>
                        {question.frequency && (
                          <Badge variant="secondary" className="gap-1">
                            <BarChart3 className="h-3 w-3" />
                            {question.frequency}x asked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Answer Preview */}
                    {expandedQuestion === question.id ? (
                      <div className="space-y-3 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                        <div>
                          <h5 className="font-semibold mb-2">Answer:</h5>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{question.answer}</p>
                        </div>
                        {question.explanation && (
                          <div>
                            <h5 className="font-semibold mb-2">Explanation:</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    ) : null}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                        className="gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        {expandedQuestion === question.id ? "Hide" : "View Answer"}
                      </Button>

                      <Button
                        variant={isFavorited ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFavorite(question.id)}
                        className={isFavorited ? "bg-pink-500 hover:bg-pink-600" : ""}
                      >
                        <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
                      </Button>

                      <Button
                        variant={progress === "attempted" ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => handleMarkProgress(question.id, "attempted")}
                      >
                        Attempted
                      </Button>

                      <Button
                        variant={progress === "mastered" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleMarkProgress(question.id, "mastered")}
                        className={progress === "mastered" ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mastered
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                No questions found with current filters. Try adjusting your selections.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
