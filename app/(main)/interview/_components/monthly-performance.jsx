"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format, startOfMonth, eachMonthOfInterval, isWithinInterval } from "date-fns";
import { TrendingUp } from "lucide-react";

export default function MonthlyPerformance({ assessments }) {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    if (assessments && assessments.length > 0) {
      // Get date range
      const dates = assessments.map((a) => new Date(a.createdAt)).sort((a, b) => a - b);
      const minDate = dates[0];
      const maxDate = dates[dates.length - 1];

      // Generate all months in the range
      const monthsInRange = eachMonthOfInterval({
        start: minDate,
        end: maxDate,
      });

      // Group assessments by month
      const monthlyStats = monthsInRange.map((monthStart) => {
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        monthEnd.setDate(0); // Last day of month

        const monthAssessments = assessments.filter((a) => {
          const assessmentDate = new Date(a.createdAt);
          return isWithinInterval(assessmentDate, {
            start: monthStart,
            end: monthEnd,
          });
        });

        if (monthAssessments.length === 0) {
          return null;
        }

        const scores = monthAssessments.map((a) => a.quizScore);
        const avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
        const maxScore = Math.max(...scores).toFixed(1);
        const minScore = Math.min(...scores).toFixed(1);

        return {
          month: format(monthStart, "MMM yyyy"),
          avgScore: parseFloat(avgScore),
          maxScore: parseFloat(maxScore),
          minScore: parseFloat(minScore),
          count: monthAssessments.length,
        };
      });

      setMonthlyData(monthlyStats.filter((item) => item !== null));
    }
  }, [assessments]);

  const calculateTrend = () => {
    if (monthlyData.length < 2) return 0;
    const firstMonth = monthlyData[0].avgScore;
    const lastMonth = monthlyData[monthlyData.length - 1].avgScore;
    return ((lastMonth - firstMonth) / firstMonth * 100).toFixed(1);
  };

  const trendValue = calculateTrend();
  const isPositiveTrend = parseFloat(trendValue) >= 0;

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl md:text-4xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                Monthly Performance Curve
              </CardTitle>
              <CardDescription>
                Track your interview prep progress month by month
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${isPositiveTrend ? "text-green-600" : "text-red-600"}`}>
                {isPositiveTrend ? "+" : ""}{trendValue}%
              </div>
              <p className="text-sm text-muted-foreground">
                {isPositiveTrend ? "Improvement" : "Decline"} trend
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis
                  dataKey="month"
                  stroke="currentColor"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="currentColor"
                  label={{ value: "Score (%)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => `${value.toFixed(1)}%`}
                  labelFormatter={(label) => `${label}`}
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold text-sm">{data.month}</p>
                          <p className="text-sm">
                            <span className="font-medium">Avg Score:</span>{" "}
                            {data.avgScore.toFixed(1)}%
                          </p>
                          <p className="text-xs text-green-600">
                            Max: {data.maxScore.toFixed(1)}%
                          </p>
                          <p className="text-xs text-red-600">
                            Min: {data.minScore.toFixed(1)}%
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Quizzes: {data.count}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="line"
                />
                <Area
                  type="monotone"
                  dataKey="avgScore"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAvg)"
                  name="Average Score"
                  dot={{ fill: "hsl(var(--primary))", r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Area
                  type="monotone"
                  dataKey="maxScore"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={0.2}
                  fill="url(#colorMax)"
                  name="Max Score"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Statistics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Breakdown</CardTitle>
          <CardDescription>
            Detailed statistics for each month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-3 font-semibold">Month</th>
                  <th className="pb-3 font-semibold text-right">Avg Score</th>
                  <th className="pb-3 font-semibold text-right">Max Score</th>
                  <th className="pb-3 font-semibold text-right">Min Score</th>
                  <th className="pb-3 font-semibold text-right">Quizzes</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((item, index) => {
                  const prevAvg = index > 0 ? monthlyData[index - 1].avgScore : item.avgScore;
                  const improvement = item.avgScore - prevAvg;
                  const isImprovement = improvement > 0;

                  return (
                    <tr
                      key={item.month}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3">{item.month}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-semibold">{item.avgScore.toFixed(1)}%</span>
                          {index > 0 && (
                            <span
                              className={`text-xs font-medium ${
                                isImprovement ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {isImprovement ? "↑" : "↓"}{Math.abs(improvement).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-right text-green-600 font-semibold">
                        {item.maxScore.toFixed(1)}%
                      </td>
                      <td className="py-3 text-right text-red-600 font-semibold">
                        {item.minScore.toFixed(1)}%
                      </td>
                      <td className="py-3 text-right">{item.count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      {monthlyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold text-sm mb-1">Best Month</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {monthlyData.reduce((max, curr) =>
                    curr.avgScore > max.avgScore ? curr : max
                  ).month}
                </p>
                <p className="text-sm text-muted-foreground">
                  {monthlyData.reduce((max, curr) =>
                    curr.avgScore > max.avgScore ? curr : max
                  ).avgScore.toFixed(1)}% average
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <h4 className="font-semibold text-sm mb-1">Consistency</h4>
                <p className="text-2xl font-bold text-purple-600">
                  {(
                    monthlyData.reduce((sum, m) => sum + m.count, 0) / monthlyData.length
                  ).toFixed(0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Quizzes per month on average
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <h4 className="font-semibold text-sm mb-1">Current Month Avg</h4>
                <p className="text-2xl font-bold text-green-600">
                  {monthlyData[monthlyData.length - 1].avgScore.toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">
                  Latest month performance
                </p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
                <h4 className="font-semibold text-sm mb-1">Overall Trend</h4>
                <p
                  className={`text-2xl font-bold ${
                    isPositiveTrend ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositiveTrend ? "↑" : "↓"} {Math.abs(trendValue)}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {isPositiveTrend ? "Improving" : "Declining"} over time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
