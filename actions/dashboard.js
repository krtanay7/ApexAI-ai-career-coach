"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
console.log(
  "GEMINI KEY LENGTH:",
  process.env.GEMINI_API_KEY?.length
);


export const generateAIInsights = async (industry) => {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText);
};

export async function getUserAnalytics() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      assessments: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      resume: true,
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // Calculate user analytics
  const totalAssessments = user.assessments.length;
  const avgScore = user.assessments.length > 0
    ? (user.assessments.reduce((sum, a) => sum + a.quizScore, 0) / user.assessments.length).toFixed(1)
    : 0;

  const assessmentsByCategory = {};
  user.assessments.forEach((a) => {
    if (!assessmentsByCategory[a.category]) {
      assessmentsByCategory[a.category] = [];
    }
    assessmentsByCategory[a.category].push(a.quizScore);
  });

  const categoryData = Object.entries(assessmentsByCategory).map(([category, scores]) => ({
    category,
    avgScore: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
    count: scores.length,
    scores,
  }));

  return {
    user,
    totalAssessments,
    avgScore,
    categoryData,
    recentAssessments: user.assessments.slice(0, 5),
  };
}

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // If no insights exist, generate them
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  return user.industryInsight;
}
