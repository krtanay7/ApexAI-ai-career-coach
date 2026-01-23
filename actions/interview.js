"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCacheKey, getFromCache, setInCache } from "@/lib/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Fallback mock data when API quota is exceeded
const getMockQuizData = () => ({
  questions: [
    {
      question: "What is the primary purpose of a database index?",
      options: [
        "To increase storage space",
        "To speed up data retrieval operations",
        "To enforce data integrity",
        "To reduce memory usage"
      ],
      correctAnswer: "To speed up data retrieval operations",
      explanation: "Database indexes create a data structure that allows faster lookups, similar to how a book's index helps you find topics quickly."
    },
    {
      question: "Which of the following best describes REST API?",
      options: [
        "A database management system",
        "A programming language",
        "An architectural style for building web services using HTTP methods",
        "A type of security protocol"
      ],
      correctAnswer: "An architectural style for building web services using HTTP methods",
      explanation: "REST (Representational State Transfer) uses HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources."
    },
    {
      question: "What is the time complexity of binary search?",
      options: [
        "O(n)",
        "O(log n)",
        "O(n log n)",
        "O(n²)"
      ],
      correctAnswer: "O(log n)",
      explanation: "Binary search divides the search space in half with each iteration, resulting in logarithmic time complexity."
    },
    {
      question: "In object-oriented programming, what is encapsulation?",
      options: [
        "Wrapping data and methods into a single unit while hiding internal details",
        "Creating multiple copies of the same class",
        "Defining abstract methods in a class",
        "Inheriting properties from a parent class"
      ],
      correctAnswer: "Wrapping data and methods into a single unit while hiding internal details",
      explanation: "Encapsulation bundles data (attributes) and methods together, controlling access through visibility modifiers."
    },
    {
      question: "What does ACID stand for in database transactions?",
      options: [
        "Atomicity, Consistency, Isolation, Durability",
        "Authorization, Compression, Indexing, Delegation",
        "Accuracy, Capability, Integration, Distribution",
        "Architecture, Compatibility, Implementation, Design"
      ],
      correctAnswer: "Atomicity, Consistency, Isolation, Durability",
      explanation: "ACID properties ensure reliable database transactions: Atomicity (all-or-nothing), Consistency (valid states), Isolation (independence), Durability (permanent)."
    },
    {
      question: "What is the main advantage of using version control systems like Git?",
      options: [
        "Faster code execution",
        "Automatic bug detection",
        "Track changes, enable collaboration, and maintain project history",
        "Reduce code file size"
      ],
      correctAnswer: "Track changes, enable collaboration, and maintain project history",
      explanation: "Version control allows teams to work together, revert changes, and maintain a complete history of project evolution."
    },
    {
      question: "Which design pattern is used to create objects without specifying their exact classes?",
      options: [
        "Observer Pattern",
        "Factory Pattern",
        "Singleton Pattern",
        "Strategy Pattern"
      ],
      correctAnswer: "Factory Pattern",
      explanation: "The Factory Pattern defines an interface for creating objects, letting subclasses decide the concrete type."
    },
    {
      question: "What is the purpose of middleware in web applications?",
      options: [
        "To store user data",
        "To process requests and responses between client and server",
        "To render HTML pages",
        "To encrypt passwords"
      ],
      correctAnswer: "To process requests and responses between client and server",
      explanation: "Middleware intercepts requests/responses, enabling authentication, logging, error handling, and other cross-cutting concerns."
    },
    {
      question: "In machine learning, what does overfitting mean?",
      options: [
        "The model has too few parameters",
        "The model learns the training data too well, including noise, and performs poorly on new data",
        "The model is too simple for the problem",
        "The training process stopped too early"
      ],
      correctAnswer: "The model learns the training data too well, including noise, and performs poorly on new data",
      explanation: "Overfitting occurs when a model memorizes training data details rather than learning generalizable patterns."
    },
    {
      question: "What is the difference between SQL and NoSQL databases?",
      options: [
        "SQL is faster than NoSQL",
        "SQL uses tables and predefined schemas; NoSQL uses flexible document-based or key-value structures",
        "NoSQL is more secure",
        "They serve the same purpose exactly"
      ],
      correctAnswer: "SQL uses tables and predefined schemas; NoSQL uses flexible document-based or key-value structures",
      explanation: "SQL databases enforce strict schemas with tables and relationships, while NoSQL offers flexibility in data structure and scaling."
    }
  ]
});

const getMockJobQuestions = (skills = "") => ({
  questions: [
    {
      question: "Tell me about a challenging project you've worked on and how you solved it.",
      type: "behavioral",
      context: "Assesses problem-solving skills and communication abilities",
      suggestedAnswer: "Describe a specific project, the challenge faced, your approach, and the outcome. Use the STAR method (Situation, Task, Action, Result).",
      tips: ["Be specific with details", "Show your contributions clearly", "Mention what you learned from the experience"]
    },
    {
      question: `Explain how you would approach learning a new ${skills || "technology or framework"} in your free time.`,
      type: "behavioral",
      context: "Shows commitment to continuous learning and self-improvement",
      suggestedAnswer: "Discuss your learning strategies: reading documentation, building projects, following tutorials, or contributing to open source.",
      tips: ["Highlight your proactive approach", "Mention resources you typically use", "Give examples of skills you've learned recently"]
    },
    {
      question: "How do you handle conflicts or disagreements with team members?",
      type: "behavioral",
      context: "Evaluates teamwork and interpersonal skills",
      suggestedAnswer: "Explain your approach: listen actively, understand different perspectives, find common ground, and escalate if needed.",
      tips: ["Show empathy and understanding", "Provide a real example if possible", "Emphasize collaboration over blame"]
    },
    {
      question: "Describe your experience with version control and collaboration in team projects.",
      type: "technical",
      context: "Tests understanding of development workflows and teamwork",
      suggestedAnswer: "Discuss Git/GitHub experience, pull requests, code reviews, and how you handle merge conflicts.",
      tips: ["Mention specific tools you've used", "Show understanding of best practices", "Discuss branch naming conventions if applicable"]
    },
    {
      question: "How do you approach debugging and troubleshooting code issues?",
      type: "technical",
      context: "Shows problem-solving methodology and attention to detail",
      suggestedAnswer: "Explain your debugging process: reproduce the issue, use debugging tools, check logs, eliminate variables, and test solutions.",
      tips: ["Mention tools and techniques you use", "Show systematic thinking", "Give an example from past experience"]
    },
    {
      question: "What interests you about this role and our company?",
      type: "behavioral",
      context: "Assesses genuine interest and research",
      suggestedAnswer: "Research the company and role. Mention specific projects, values, or problems you want to solve with them.",
      tips: ["Be specific and sincere", "Show understanding of the company's mission", "Connect their needs with your skills"]
    },
    {
      question: "Describe a time when you had to learn something quickly to meet a deadline.",
      type: "behavioral",
      context: "Evaluates adaptability and pressure handling",
      suggestedAnswer: "Share an example where you rapidly acquired new knowledge, your learning methods, and the successful outcome.",
      tips: ["Show resilience under pressure", "Highlight your learning speed", "Mention how you applied the knowledge"]
    },
    {
      question: "What are your strengths and areas for improvement as a developer?",
      type: "behavioral",
      context: "Tests self-awareness and growth mindset",
      suggestedAnswer: "Be honest about strengths with examples. For improvements, show you're actively working to develop them.",
      tips: ["Choose real, relevant strengths", "Don't mention critical weaknesses", "Show concrete improvement efforts"]
    }
  ]
});

export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    // Check cache first
    const cacheKey = getCacheKey("quiz", user.industry, user.skills?.join(","));
    let quiz;
    
    const cachedQuiz = getFromCache(cacheKey);
    if (cachedQuiz) {
      console.log("Using cached quiz (saved 1 API call)");
      quiz = cachedQuiz;
    } else {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      quiz = JSON.parse(cleanedText);
      // Cache the result
      setInCache(cacheKey, quiz);
    }

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    // Check for quota exceeded
    if (error.message.includes("429") || error.message.includes("quota") || error.message.includes("RESOURCE_EXHAUSTED")) {
      console.warn("API quota exceeded, using fallback mock questions");
      return getMockQuizData().questions;
    }
    throw new Error("Failed to generate quiz questions. Using default questions instead.");
  }
}

export async function generateJobSpecificQuestions(jobDescription = "") {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      skills: true,
      resume: true,
    },
  });

  if (!user) throw new Error("User not found");

  const skillsList = user.skills?.length ? user.skills.join(", ") : "general technical skills";

  const prompt = `
    Generate 8 targeted interview questions for a job interview based on:
    
    Student's Skills: ${skillsList}
    Job Description: ${jobDescription || "Not provided - generate general questions for their skills"}
    
    Create questions that:
    1. Match the job requirements if a job description is provided
    2. Test the candidate's actual technical skills
    3. Include behavioral and technical questions
    4. Are realistic for actual interviews
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "type": "technical",
          "context": "why this question is asked",
          "suggestedAnswer": "string",
          "tips": ["tip1", "tip2", "tip3"]
        }
      ]
    }
  `;

  try {
    // Check cache first
    const cacheKey = getCacheKey("jobQuestions", user.skills?.join(","), jobDescription);
    let questions;
    
    const cachedQuestions = getFromCache(cacheKey);
    if (cachedQuestions) {
      console.log("Using cached job questions (saved 1 API call)");
      questions = cachedQuestions;
    } else {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      questions = JSON.parse(cleanedText);
      // Cache the result
      setInCache(cacheKey, questions);
    }

    return questions.questions;
  } catch (error) {
    console.error("Error generating job-specific questions:", error);
    // Check for quota exceeded
    if (error.message.includes("429") || error.message.includes("quota") || error.message.includes("RESOURCE_EXHAUSTED")) {
      console.warn("API quota exceeded, using fallback job interview questions");
      return getMockJobQuestions(skillsList).questions;
    }
    throw new Error("Failed to generate job-specific interview questions. Using default questions instead.");
  }
}

export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Get wrong answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const tipResult = await model.generateContent(improvementPrompt);

      improvementTip = tipResult.response.text().trim();
      console.log(improvementTip);
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // Continue without improvement tip if generation fails
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}
