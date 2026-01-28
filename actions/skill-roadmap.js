"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCacheKey, getFromCache, setInCache } from "@/lib/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-2.0-flash" });

// Mock data for fallback when API quota exceeded
const getMockRoadmap = (currentSkills, targetSkills) => ({
  phases: [
    {
      phase: 1,
      name: "Foundation Building (Month 1)",
      duration: "4 weeks",
      skills: targetSkills.slice(0, 2),
      resources: [
        { type: "course", title: "Complete Intro Course", platform: "Udemy", duration: "20 hours" },
        { type: "documentation", title: "Official Documentation", platform: "Official Docs", duration: "Self-paced" },
        { type: "practice", title: "Basic Exercises", platform: "LeetCode", duration: "10 hours" }
      ],
      milestone: "Complete 2-3 small projects demonstrating basic understanding",
      tips: "Focus on understanding fundamentals before moving to advanced topics"
    },
    {
      phase: 2,
      name: "Skill Development (Month 2-3)",
      duration: "8 weeks",
      skills: targetSkills.slice(2, 4),
      resources: [
        { type: "course", title: "Advanced Concepts", platform: "Coursera", duration: "30 hours" },
        { type: "project", title: "Build Real Project", platform: "Self-directed", duration: "40 hours" },
        { type: "tutorial", title: "Advanced Tutorials", platform: "YouTube/Blogs", duration: "15 hours" }
      ],
      milestone: "Build 1-2 portfolio projects showcasing new skills",
      tips: "Implement real-world use cases and contribute to open source"
    },
    {
      phase: 3,
      name: "Mastery & Specialization (Month 4-6)",
      duration: "12 weeks",
      skills: targetSkills.slice(4),
      resources: [
        { type: "certification", title: "Professional Certification", platform: "Official Cert", duration: "prep: 50 hours" },
        { type: "advanced", title: "Advanced Projects", platform: "Self-directed", duration: "60 hours" },
        { type: "community", title: "Community Contribution", platform: "Open Source/Communities", duration: "Ongoing" }
      ],
      milestone: "Achieve certification and complete 2+ advanced projects",
      tips: "Teach others, mentor juniors, and establish yourself as an expert"
    }
  ]
});

export async function generateSkillRoadmap() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  const currentSkills = user.skills || [];
  const targetSkills = user.industryInsight?.topSkills || user.industryInsight?.recommendedSkills || [];

  if (targetSkills.length === 0) {
    throw new Error("Industry insights not found. Please set your industry first.");
  }

  // Skills to learn (not in current skills)
  const skillsToLearn = targetSkills.filter(skill => !currentSkills.includes(skill));

  const prompt = `
    Create a detailed skill improvement roadmap for a professional to transition from their current skills to industry-required skills.
    
    Current Skills: ${currentSkills.join(", ") || "Basic fundamentals"}
    Industry: ${user.industry || "Technology"}
    Target Skills to Learn: ${skillsToLearn.join(", ")}
    Years of Experience: ${user.experience || "Entry-level"}
    
    Generate a structured 3-phase roadmap with the following JSON format ONLY (no additional text):
    {
      "phases": [
        {
          "phase": 1,
          "name": "string (e.g., 'Foundation Building')",
          "duration": "string (e.g., '4 weeks')",
          "skills": ["skill1", "skill2"],
          "resources": [
            {
              "type": "course|project|practice|certification|tutorial|community",
              "title": "string",
              "platform": "string (e.g., Udemy, Coursera, GitHub)",
              "duration": "string (e.g., '20 hours')"
            }
          ],
          "milestone": "string (achievable goal for this phase)",
          "tips": "string (practical advice)"
        }
      ]
    }
    
    Requirements:
    1. Create exactly 3 phases (Foundation, Development, Mastery)
    2. Distribute skills across phases logically
    3. Include 3-4 realistic resources per phase
    4. Make milestones achievable and measurable
    5. Provide practical, actionable tips
    6. Estimate realistic timeframes based on skill difficulty
  `;

  try {
    const cacheKey = getCacheKey("skillRoadmap", user.id, skillsToLearn.join(","));
    let roadmapData;

    const cachedRoadmap = getFromCache(cacheKey);
    if (cachedRoadmap) {
      console.log("Using cached skill roadmap");
      roadmapData = cachedRoadmap;
    } else {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      roadmapData = JSON.parse(cleanedText);
      setInCache(cacheKey, roadmapData);
    }

    // Calculate overall progress
    const learnedSkills = skillsToLearn.filter(skill => currentSkills.includes(skill)).length;
    const overallProgress = skillsToLearn.length > 0 ? Math.round((learnedSkills / skillsToLearn.length) * 100) : 0;

    // Save to database
    const roadmap = await db.skillRoadmap.upsert({
      where: { userId: user.id },
      update: {
        currentSkills,
        targetSkills,
        phases: roadmapData.phases,
        overallProgress,
        estimatedDuration: "3-6 months",
      },
      create: {
        userId: user.id,
        currentSkills,
        targetSkills,
        phases: roadmapData.phases,
        overallProgress,
        estimatedDuration: "3-6 months",
      },
    });

    return roadmap;
  } catch (error) {
    console.error("Error generating skill roadmap:", error);
    
    // Fallback to mock data if API quota exceeded
    if (error.message.includes("429") || error.message.includes("quota") || error.message.includes("RESOURCE_EXHAUSTED")) {
      console.warn("API quota exceeded, using fallback roadmap");
      const mockData = getMockRoadmap(currentSkills, skillsToLearn);
      
      const roadmap = await db.skillRoadmap.upsert({
        where: { userId: user.id },
        update: {
          currentSkills,
          targetSkills,
          phases: mockData.phases,
          overallProgress: 0,
          estimatedDuration: "3-6 months",
        },
        create: {
          userId: user.id,
          currentSkills,
          targetSkills,
          phases: mockData.phases,
          overallProgress: 0,
          estimatedDuration: "3-6 months",
        },
      });
      
      return roadmap;
    }
    
    throw new Error("Failed to generate skill roadmap. Please try again later.");
  }
}

export async function getSkillRoadmap() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const roadmap = await db.skillRoadmap.findUnique({
    where: { userId: user.id },
  });

  if (!roadmap) {
    // Generate if doesn't exist
    return await generateSkillRoadmap();
  }

  return roadmap;
}

export async function updateRoadmapProgress(skillsCompleted) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const roadmap = await db.skillRoadmap.findUnique({
    where: { userId: user.id },
  });

  if (!roadmap) throw new Error("Roadmap not found");

  // Update user skills
  const updatedSkills = [...new Set([...user.skills, ...skillsCompleted])];
  
  await db.user.update({
    where: { id: user.id },
    data: { skills: updatedSkills },
  });

  // Calculate progress
  const targetSkillsSet = new Set(roadmap.targetSkills);
  const completedCount = updatedSkills.filter(skill => targetSkillsSet.has(skill)).length;
  const progress = Math.round((completedCount / roadmap.targetSkills.length) * 100);

  // Update roadmap
  return await db.skillRoadmap.update({
    where: { userId: user.id },
    data: {
      overallProgress: progress,
    },
  });
}
