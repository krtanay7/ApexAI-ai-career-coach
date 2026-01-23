"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  BriefcaseIcon,
  TrendingUp,
  TrendingDown,
  Brain,
  CheckCircle2,
  AlertCircle,
  Target,
  Award,
  BookOpen,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const DashboardView = ({ insights, analytics }) => {
  // Transform salary data for the chart
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  // Assessment data for line chart
  const assessmentTimeline = useMemo(() => {
    if (!analytics?.recentAssessments) return [];
    return analytics.recentAssessments
      .reverse()
      .map((a, idx) => ({
        date: format(new Date(a.createdAt), "MMM dd"),
        score: a.quizScore,
        category: a.category,
      }));
  }, [analytics]);

  // Skill Gap Analysis - comparing user skills vs required
  const skillGapData = useMemo(() => {
    if (!analytics?.user?.skills || !insights?.topSkills) return [];
    const userSkills = new Set(analytics.user.skills);
    return insights.topSkills.map((skill) => ({
      skill,
      hasSkill: userSkills.has(skill) ? 100 : 0,
    }));
  }, [analytics, insights]);

  // Category performance pie chart
  const categoryPerformance = useMemo(() => {
    if (!analytics?.categoryData) return [];
    return analytics.categoryData.map((cat) => ({
      name: cat.category,
      value: parseFloat(cat.avgScore),
      count: cat.count,
    }));
  }, [analytics]);

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: TrendingUp, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: TrendingUp, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  // Calculate professional metrics
  const assessmentCompletion = analytics?.totalAssessments || 0;
  const avgAssessmentScore = parseFloat(analytics?.avgScore || 0);
  const resumeQuality = analytics?.user?.resume ? 85 : 0;
  const skillCompletionRate = useMemo(() => {
    if (!analytics?.user?.skills || !insights?.topSkills) return 0;
    const userSkills = new Set(analytics.user.skills);
    const matchedSkills = insights.topSkills.filter((s) => userSkills.has(s)).length;
    return Math.round((matchedSkills / insights.topSkills.length) * 100);
  }, [analytics, insights]);

  return (
    <div className="space-y-6 py-6">
      {/* Header with timestamp */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Career Analytics Dashboard</h1>
        <Badge variant="outline">Updated: {lastUpdatedDate}</Badge>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Assessment Score</CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAssessmentScore}%</div>
            <p className="text-xs text-muted-foreground">
              {assessmentCompletion} assessments completed
            </p>
            <Progress value={avgAssessmentScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Match Rate</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skillCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Industry requirements aligned
            </p>
            <Progress value={skillCompletionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resume Quality</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumeQuality}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.user?.resume ? "Resume created" : "No resume yet"}
            </p>
            <Progress value={resumeQuality} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Outlook</CardTitle>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.marketOutlook}</div>
            <p className="text-xs text-muted-foreground">
              Next update {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industry Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress value={Math.min(insights.growthRate, 100)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.demandLevel}</div>
            <div
              className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
                insights.demandLevel
              )}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skills Required</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {insights.topSkills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Salary Ranges Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Salary Ranges by Role</CardTitle>
            <CardDescription>
              Minimum, median, and maximum salaries in thousands (K)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#f8f9fa", border: "1px solid #e5e7eb" }}
                    formatter={(value) => `$${value}K`}
                  />
                  <Legend />
                  <Bar dataKey="min" fill="#94a3b8" name="Min Salary" />
                  <Bar dataKey="median" fill="#64748b" name="Median Salary" />
                  <Bar dataKey="max" fill="#475569" name="Max Salary" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Performance Timeline */}
        {assessmentTimeline.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Assessment Performance Timeline</CardTitle>
              <CardDescription>Your score progression over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={assessmentTimeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#f8f9fa", border: "1px solid #e5e7eb" }}
                      formatter={(value) => `${value}%`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      dot={{ fill: "#3b82f6", r: 4 }}
                      name="Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skill Gap Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Gap Analysis</CardTitle>
            <CardDescription>Your skills vs. industry requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={skillGapData}
                  layout="vertical"
                  margin={{ left: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="skill" type="category" width={100} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#f8f9fa", border: "1px solid #e5e7eb" }}
                    formatter={(value) => (value === 100 ? "✓ Have" : "✗ Need")}
                  />
                  <Bar dataKey="hasSkill" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Performance Distribution */}
        {categoryPerformance.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Assessment Category Performance</CardTitle>
              <CardDescription>Average score by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `${value.toFixed(1)}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Industry Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Key Industry Trends</CardTitle>
            <CardDescription>
              Current trends shaping the {analytics?.user?.industry} industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <span className="text-sm">{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Skills to Develop</CardTitle>
            <CardDescription>
              Skills that will boost your career prospects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="cursor-pointer hover:bg-blue-50">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Career Progression Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Career Progression Roadmap
          </CardTitle>
          <CardDescription>
            Recommended path based on your current skills and market trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div className="h-12 w-0.5 bg-blue-200" />
              </div>
              <div className="pt-1">
                <h4 className="font-semibold">Complete Core Assessments</h4>
                <p className="text-sm text-muted-foreground">
                  {assessmentCompletion}/5 completed - Build a strong foundation in core competencies
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div className="h-12 w-0.5 bg-purple-200" />
              </div>
              <div className="pt-1">
                <h4 className="font-semibold">Develop Top-Demand Skills</h4>
                <p className="text-sm text-muted-foreground">
                  Currently at {skillCompletionRate}% - Focus on: {insights.topSkills.slice(0, 2).join(", ")}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div className="h-12 w-0.5 bg-green-200" />
              </div>
              <div className="pt-1">
                <h4 className="font-semibold">Optimize Resume & Portfolio</h4>
                <p className="text-sm text-muted-foreground">
                  Currently at {resumeQuality}% - Highlight achievements in {insights.topSkills[0]}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                  4
                </div>
              </div>
              <div className="pt-1">
                <h4 className="font-semibold">Target Roles with Market Demand</h4>
                <p className="text-sm text-muted-foreground">
                  {insights.demandLevel} demand in your industry - Median salary: ${
                    salaryData[0]?.median
                  }K+
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader>
          <CardTitle>Your Career Readiness Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{assessmentCompletion}</div>
              <p className="text-sm text-muted-foreground">Tests Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{skillCompletionRate}%</div>
              <p className="text-sm text-muted-foreground">Skills Matched</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{avgAssessmentScore}%</div>
              <p className="text-sm text-muted-foreground">Avg. Score</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{insights.topSkills.length}</div>
              <p className="text-sm text-muted-foreground">In-Demand Skills</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardView;
