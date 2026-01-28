"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("GEMINI KEY LENGTH:", process.env.GEMINI_API_KEY?.length);


// Industry-specific skills mapping
const industrySkillsMap = {
  "Software Development": {
    topSkills: ["JavaScript", "React", "Node.js", "Python", "TypeScript"],
    recommendedSkills: ["Cloud platforms (AWS, GCP, Azure)", "Docker", "Kubernetes", "REST APIs", "Database design"]
  },
  "Data Science": {
    topSkills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Statistics"],
    recommendedSkills: ["Data visualization (Tableau, Power BI)", "Big Data tools (Spark, Hadoop)", "Data preprocessing", "Statistical analysis", "Deep learning"]
  },
  "Finance": {
    topSkills: ["Excel", "Financial Analysis", "Risk Management", "Python", "SQL"],
    recommendedSkills: ["Bloomberg Terminal", "VBA", "Financial modeling", "Valuation", "Regulatory compliance"]
  },
  "Healthcare": {
    topSkills: ["Patient Care", "Electronic Health Records (EHR)", "Clinical Knowledge", "Communication", "HIPAA Compliance"],
    recommendedSkills: ["Medical coding", "Healthcare IT systems", "Patient advocacy", "Medical terminology", "Care coordination"]
  },
  "Marketing": {
    topSkills: ["Digital Marketing", "SEO/SEM", "Analytics", "Content Creation", "Social Media Management"],
    recommendedSkills: ["Google Analytics", "Adobe Creative Suite", "Copywriting", "Marketing automation", "Brand strategy"]
  },
  "Sales": {
    topSkills: ["Negotiation", "CRM (Salesforce)", "Customer Relationship Management", "Communication", "Market Knowledge"],
    recommendedSkills: ["Sales forecasting", "Territory management", "Pipeline management", "B2B/B2C strategies", "Closing techniques"]
  },
  "Project Management": {
    topSkills: ["Agile", "Scrum", "Risk Management", "Stakeholder Communication", "JIRA/Monday.com"],
    recommendedSkills: ["PMP certification", "Lean methodology", "Budget management", "Team leadership", "Resource planning"]
  },
  "Human Resources": {
    topSkills: ["Recruitment", "Employee Relations", "HR Systems", "Compliance", "Compensation & Benefits"],
    recommendedSkills: ["HRIS platforms", "Training & development", "Performance management", "Labor law", "Employee engagement"]
  },
  "Cybersecurity": {
    topSkills: ["Network Security", "Penetration Testing", "Security Protocols", "Encryption", "Incident Response"],
    recommendedSkills: ["Ethical hacking", "Security information and event management (SIEM)", "Firewalls", "Threat analysis", "Security compliance"]
  },
  "DevOps": {
    topSkills: ["Docker", "Kubernetes", "CI/CD Pipelines", "AWS/Azure", "Linux"],
    recommendedSkills: ["Infrastructure as Code (Terraform)", "Monitoring tools (Prometheus)", "Automation", "Container orchestration", "Cloud architecture"]
  }
};

// Mock data for industry insights fallback
const getMockIndustryInsights = (industry) => {
  // Get industry-specific skills, fallback to default if not found
  const industrySkills = industrySkillsMap[industry] || industrySkillsMap["Software Development"];
  
  // Map industry to relevant roles and salaries
  const industryRolesMap = {
    "Software Development": [
      { role: "Junior Developer", min: 50000, max: 70000, median: 60000, location: "Remote" },
      { role: "Senior Developer", min: 100000, max: 150000, median: 125000, location: "Remote" },
      { role: "Tech Lead", min: 120000, max: 170000, median: 145000, location: "Remote" },
      { role: "Solution Architect", min: 130000, max: 180000, median: 155000, location: "On-site" },
      { role: "DevOps Engineer", min: 90000, max: 140000, median: 115000, location: "Remote" },
    ],
    "Data Science": [
      { role: "Junior Data Analyst", min: 55000, max: 75000, median: 65000, location: "Remote" },
      { role: "Data Scientist", min: 90000, max: 130000, median: 110000, location: "Remote" },
      { role: "Senior Data Scientist", min: 120000, max: 180000, median: 150000, location: "Remote" },
      { role: "ML Engineer", min: 100000, max: 160000, median: 130000, location: "Remote" },
      { role: "Analytics Manager", min: 110000, max: 160000, median: 135000, location: "On-site" },
    ],
    "Finance": [
      { role: "Financial Analyst", min: 60000, max: 85000, median: 72000, location: "On-site" },
      { role: "Investment Banker", min: 80000, max: 200000, median: 140000, location: "On-site" },
      { role: "Risk Manager", min: 90000, max: 150000, median: 120000, location: "On-site" },
      { role: "Financial Advisor", min: 70000, max: 120000, median: 95000, location: "On-site" },
      { role: "CFO", min: 150000, max: 300000, median: 225000, location: "On-site" },
    ],
    "Healthcare": [
      { role: "Registered Nurse", min: 55000, max: 75000, median: 65000, location: "On-site" },
      { role: "Physician", min: 200000, max: 400000, median: 300000, location: "On-site" },
      { role: "Medical Technologist", min: 45000, max: 65000, median: 55000, location: "On-site" },
      { role: "Healthcare Administrator", min: 70000, max: 120000, median: 95000, location: "On-site" },
      { role: "Clinical Manager", min: 90000, max: 140000, median: 115000, location: "On-site" },
    ],
    "Marketing": [
      { role: "Marketing Coordinator", min: 40000, max: 55000, median: 47500, location: "Remote" },
      { role: "Digital Marketing Manager", min: 60000, max: 90000, median: 75000, location: "Remote" },
      { role: "Content Strategist", min: 55000, max: 85000, median: 70000, location: "Remote" },
      { role: "Marketing Director", min: 100000, max: 160000, median: 130000, location: "On-site" },
      { role: "CMO", min: 130000, max: 250000, median: 190000, location: "On-site" },
    ],
  };
  
  const salaryRanges = industryRolesMap[industry] || industryRolesMap["Software Development"];
  
  const mockData = {
    salaryRanges,
    growthRate: 12,
    demandLevel: "High",
    topSkills: industrySkills.topSkills,
    marketOutlook: "Positive",
    keyTrends: [
      `Industry transformation in ${industry}`,
      "Remote work and flexible arrangements expansion",
      "Continuous learning and skill development emphasis",
      "Automation and AI integration",
      "Diversity and inclusion initiatives"
    ],
    recommendedSkills: industrySkills.recommendedSkills,
  };
  return mockData;
};

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

  // Try a list of candidate models and fall back if a model isn't available
  const modelCandidates = [
    "gemini-2.0-flash",
  ];

  let lastError = null;
  for (const modelName of modelCandidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

      return JSON.parse(cleanedText);
    } catch (err) {
      lastError = err;
      console.warn(`Model ${modelName} failed:`, err?.message || err);
      // try next model
      continue;
    }
  }

  // If we reach here, all model attempts failed - use mock data
  console.warn(`All model attempts failed when generating industry insights: ${lastError?.message || lastError}. Using mock data.`);
  return getMockIndustryInsights(industry);
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
