"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCacheKey, getFromCache, setInCache } from "@/lib/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});

const getMockCoverLetter = (data, user) => `
# Cover Letter

Dear Hiring Manager,

I am writing to express my strong interest in the ${data.jobTitle} position at ${data.companyName}. With my background in ${user.industry} and ${user.experience} years of experience, I am confident in my ability to contribute to your team.

Throughout my career, I have developed expertise in ${user.skills?.slice(0, 3).join(", ") || "key industry skills"}. My professional background includes ${user.bio || "diverse project implementations"}, which has equipped me with a comprehensive understanding of industry best practices and innovative solutions.

I am particularly drawn to this opportunity because of my passion for ${data.companyName}'s mission and values. I am eager to bring my skills and experience to your organization and contribute to your continued success.

Thank you for considering my application. I look forward to discussing how I can be a valuable asset to your team.

Sincerely,
${user.name || "Candidate"}
`;

export async function generateCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${
    data.companyName
  }.
    
    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

  try {
    // Check cache first
    const cacheKey = getCacheKey("coverLetter", data.jobTitle, data.companyName, user.industry);
    const cachedContent = getFromCache(cacheKey);
    
    let content;
    if (cachedContent) {
      console.log("Using cached cover letter (saved 1 API call)");
      content = cachedContent;
    } else {
      try {
        const result = await model.generateContent(prompt);
        content = result.response.text().trim();
        // Cache the result
        setInCache(cacheKey, content);
      } catch (apiError) {
        console.warn("API call failed, using mock cover letter:", apiError?.message);
        // Use mock data if API fails
        content = getMockCoverLetter(data, user);
      }
    }

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw new Error("Failed to generate cover letter. Please try again later.");
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function updateCoverLetter(id, content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      content,
      updatedAt: new Date(),
    },
  });
}
