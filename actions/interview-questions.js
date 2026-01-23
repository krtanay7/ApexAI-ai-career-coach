"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Mock interview questions - extensive bank
const getMockQuestions = () => [
  // Google DSA Questions
  {
    question: "Design a system to find top K frequent elements in an array",
    answer: "Use a min heap of size K or HashMap + sorting approach",
    explanation: "HashMap approach: Count frequencies, sort by frequency, return top K elements",
    company: "Google",
    category: "DSA",
    difficulty: "Medium",
    role: "Software Engineer",
    tags: ["Array", "Heap", "HashMap"],
    frequency: 45,
    mostAskedBy: ["Google", "Amazon", "Facebook"]
  },
  {
    question: "Implement LRU Cache",
    answer: "Use HashMap + Doubly Linked List for O(1) operations",
    explanation: "HashMap stores key->node mapping, LinkedList maintains order. On access, move node to end.",
    company: "Google",
    category: "DSA",
    difficulty: "Hard",
    role: "Software Engineer",
    tags: ["Design", "Cache", "LinkedList"],
    frequency: 60,
    mostAskedBy: ["Google", "Amazon", "Microsoft"]
  },
  {
    question: "Serialize and Deserialize Binary Tree",
    answer: "Use level-order or pre-order traversal to serialize",
    explanation: "Pre-order: visit node, then left, then right. Use markers for null nodes.",
    company: "Google",
    category: "DSA",
    difficulty: "Hard",
    role: "Software Engineer",
    tags: ["Tree", "Serialization"],
    frequency: 35,
    mostAskedBy: ["Google", "Amazon"]
  },
  {
    question: "Longest Substring Without Repeating Characters",
    answer: "Sliding window with HashMap to track characters",
    explanation: "Expand window by moving right pointer, shrink from left when duplicate found",
    company: "Google",
    category: "DSA",
    difficulty: "Medium",
    role: "Software Engineer",
    tags: ["String", "SlidingWindow"],
    frequency: 50,
    mostAskedBy: ["Google", "Amazon", "Apple"]
  },
  {
    question: "Word Ladder (BFS problem)",
    answer: "Use BFS to find shortest path from beginWord to endWord",
    explanation: "Each word is a node, edges connect words differing by one letter",
    company: "Google",
    category: "DSA",
    difficulty: "Hard",
    role: "Software Engineer",
    tags: ["Graph", "BFS"],
    frequency: 32,
    mostAskedBy: ["Google", "LinkedIn"]
  },

  // Amazon DSA Questions
  {
    question: "Two Sum Problem",
    answer: "Use HashMap to store numbers and find complements in O(n)",
    explanation: "For each number, check if target-number exists in map, then add current number",
    company: "Amazon",
    category: "DSA",
    difficulty: "Easy",
    role: "Software Engineer",
    tags: ["Array", "HashMap"],
    frequency: 55,
    mostAskedBy: ["Amazon", "Google", "Facebook"]
  },
  {
    question: "Merge K Sorted Lists",
    answer: "Use min heap or divide and conquer approach",
    explanation: "Min heap: add first node of each list, pop min, add next node from same list",
    company: "Amazon",
    category: "DSA",
    difficulty: "Hard",
    role: "Software Engineer",
    tags: ["LinkedList", "Heap"],
    frequency: 40,
    mostAskedBy: ["Amazon", "Google"]
  },
  {
    question: "Number of Islands (DFS/BFS)",
    answer: "Use DFS or BFS to mark visited land cells",
    explanation: "For each unvisited '1', do DFS/BFS and mark all connected 1s as visited",
    company: "Amazon",
    category: "DSA",
    difficulty: "Medium",
    role: "Software Engineer",
    tags: ["Graph", "DFS", "BFS"],
    frequency: 48,
    mostAskedBy: ["Amazon", "Google", "Bloomberg"]
  },
  {
    question: "Maximum Product Subarray",
    answer: "Track both max and min product ending at each position",
    explanation: "Use DP: max[i] = max(nums[i], max[i-1]*nums[i], min[i-1]*nums[i])",
    company: "Amazon",
    category: "DSA",
    difficulty: "Hard",
    role: "Software Engineer",
    tags: ["DP", "Array"],
    frequency: 38,
    mostAskedBy: ["Amazon", "Microsoft"]
  },

  // System Design Questions
  {
    question: "Design a URL Shortening Service (like TinyURL)",
    answer: "Use Base62 encoding, hash table for mapping, database for persistence",
    explanation: "Map short URL to long URL using incrementing counter or hash function",
    company: "Google",
    category: "System Design",
    difficulty: "Medium",
    role: "Software Engineer",
    tags: ["SystemDesign", "Distributed"],
    frequency: 52,
    mostAskedBy: ["Google", "Amazon", "Microsoft"]
  },
  {
    question: "Design a Caching System (like Redis)",
    answer: "Use LRU eviction, concurrent HashMap, and expiration policy",
    explanation: "HashMap for O(1) access, LinkedList for LRU order, timer for expiration",
    company: "Amazon",
    category: "System Design",
    difficulty: "Hard",
    role: "Software Engineer",
    tags: ["SystemDesign", "Cache"],
    frequency: 45,
    mostAskedBy: ["Amazon", "Google"]
  },
  {
    question: "Design a Load Balancer",
    answer: "Distribute requests using Round Robin, Least Connections, or IP Hash",
    explanation: "Maintain server pool, health checks, and routing algorithm",
    company: "Microsoft",
    category: "System Design",
    difficulty: "Hard",
    role: "Software Engineer",
    tags: ["SystemDesign", "DistributedSystems"],
    frequency: 40,
    mostAskedBy: ["Microsoft", "Google", "Amazon"]
  },
  {
    question: "Design a Real-time Chat Application",
    answer: "Use WebSockets for real-time, message queue for delivery, database for persistence",
    explanation: "WebSocket connection per user, Redis pub/sub for distribution, SQL for history",
    company: "Facebook",
    category: "System Design",
    difficulty: "Hard",
    role: "Software Engineer",
    tags: ["SystemDesign", "RealTime", "WebSocket"],
    frequency: 42,
    mostAskedBy: ["Facebook", "Amazon"]
  },

  // Behavioral Questions
  {
    question: "Tell me about a time you had to work with a difficult team member",
    answer: "Show empathy, communication, and conflict resolution skills",
    explanation: "Use STAR method: Situation, Task, Action, Result. Focus on how you resolved it professionally",
    company: "Google",
    category: "Behavioral",
    difficulty: "Medium",
    role: "Software Engineer",
    tags: ["Teamwork", "Communication"],
    frequency: 35,
    mostAskedBy: ["Google", "Amazon", "Microsoft"]
  },
  {
    question: "Describe a situation where you failed and what you learned",
    answer: "Choose a real example, explain root cause, and learning outcome",
    explanation: "Show humility and growth mindset. Focus on what you learned, not excuses",
    company: "Amazon",
    category: "Behavioral",
    difficulty: "Medium",
    role: "Software Engineer",
    tags: ["Growth", "Learning"],
    frequency: 40,
    mostAskedBy: ["Amazon", "Microsoft"]
  },
  {
    question: "How do you handle pressure and tight deadlines?",
    answer: "Prioritize tasks, communicate clearly, and maintain code quality",
    explanation: "Give specific example of how you managed time and delivered quality",
    company: "Microsoft",
    category: "Behavioral",
    difficulty: "Easy",
    role: "Software Engineer",
    tags: ["Stress", "TimeManagement"],
    frequency: 38,
    mostAskedBy: ["Microsoft", "Google"]
  },
  {
    question: "Describe your approach to code reviews",
    answer: "Be constructive, focus on code not person, learn from others",
    explanation: "Show respect, ask questions, suggest improvements diplomatically",
    company: "Google",
    category: "Behavioral",
    difficulty: "Easy",
    role: "Software Engineer",
    tags: ["CodeQuality", "Collaboration"],
    frequency: 32,
    mostAskedBy: ["Google", "Amazon"]
  },

  // Database Questions
  {
    question: "Explain Database Indexing and when to use it",
    answer: "Index speeds up queries but slows down inserts/updates",
    explanation: "B-tree index for range queries, Hash index for equality. Trade-off between read and write",
    company: "Amazon",
    category: "Database",
    difficulty: "Medium",
    role: "Software Engineer",
    tags: ["Database", "SQL"],
    frequency: 44,
    mostAskedBy: ["Amazon", "Microsoft"]
  },
  {
    question: "What are ACID properties in databases?",
    answer: "Atomicity, Consistency, Isolation, Durability",
    explanation: "Atomicity: all or nothing. Consistency: valid state. Isolation: concurrent access. Durability: persisted",
    company: "Microsoft",
    category: "Database",
    difficulty: "Medium",
    role: "Software Engineer",
    tags: ["Database", "Transactions"],
    frequency: 48,
    mostAskedBy: ["Microsoft", "Google"]
  },
  {
    question: "Difference between SQL and NoSQL databases",
    answer: "SQL: structured, ACID, SQL queries. NoSQL: flexible, eventual consistency, various models",
    explanation: "SQL best for structured data, NoSQL for scalability and flexibility",
    company: "Google",
    category: "Database",
    difficulty: "Medium",
    role: "Software Engineer",
    tags: ["Database", "Design"],
    frequency: 50,
    mostAskedBy: ["Google", "Amazon"]
  }
];

// Get questions by company
export async function getQuestionsByCompany(company, difficulty = null, limit = 20) {
  try {
    const where = { company };
    if (difficulty) where.difficulty = difficulty;

    const questions = await db.interviewQuestion.findMany({
      where,
      take: limit,
      orderBy: { frequency: "desc" },
    });

    // Fallback to mock if empty
    if (questions.length === 0) {
      return getMockQuestions().filter(q => q.company === company && (!difficulty || q.difficulty === difficulty)).slice(0, limit);
    }

    return questions;
  } catch (error) {
    console.error("Error fetching questions by company:", error);
    return getMockQuestions().filter(q => q.company === company && (!difficulty || q.difficulty === difficulty)).slice(0, limit);
  }
}

// Get questions by category
export async function getQuestionsByCategory(category, difficulty = null, limit = 20) {
  try {
    const where = { category };
    if (difficulty) where.difficulty = difficulty;

    const questions = await db.interviewQuestion.findMany({
      where,
      take: limit,
      orderBy: { frequency: "desc" },
    });

    if (questions.length === 0) {
      return getMockQuestions().filter(q => q.category === category && (!difficulty || q.difficulty === difficulty)).slice(0, limit);
    }

    return questions;
  } catch (error) {
    console.error("Error fetching questions by category:", error);
    return getMockQuestions().filter(q => q.category === category && (!difficulty || q.difficulty === difficulty)).slice(0, limit);
  }
}

// Get all questions for a user
export async function getAllQuestions(filters = {}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const where = {};
    if (filters.company) where.company = filters.company;
    if (filters.category) where.category = filters.category;
    if (filters.difficulty) where.difficulty = filters.difficulty;
    if (filters.role) where.role = filters.role;

    const questions = await db.interviewQuestion.findMany({
      where,
      take: filters.limit || 50,
      orderBy: { frequency: "desc" },
      include: {
        progressRecords: {
          where: { userId },
          select: { status: true, attempts: true },
        },
        favoriteBy: {
          where: { userId },
          select: { id: true },
        },
      },
    });

    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return getMockQuestions().slice(0, 50);
  }
}

// Save to favorites
export async function toggleFavoriteQuestion(questionId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Check if already favorited
    const existing = await db.favoriteQuestion.findUnique({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId,
        },
      },
    });

    if (existing) {
      // Remove from favorites
      await db.favoriteQuestion.delete({
        where: {
          userId_questionId: {
            userId: user.id,
            questionId,
          },
        },
      });
      return { favorited: false };
    } else {
      // Add to favorites
      await db.favoriteQuestion.create({
        data: {
          userId: user.id,
          questionId,
        },
      });
      return { favorited: true };
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
}

// Mark question as attempted/mastered
export async function markQuestionProgress(questionId, status) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const existing = await db.questionProgress.findUnique({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId,
        },
      },
    });

    if (existing) {
      return await db.questionProgress.update({
        where: {
          userId_questionId: {
            userId: user.id,
            questionId,
          },
        },
        data: {
          status,
          attempts: existing.attempts + 1,
          lastAttempted: new Date(),
        },
      });
    } else {
      return await db.questionProgress.create({
        data: {
          userId: user.id,
          questionId,
          status,
          attempts: 1,
          lastAttempted: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("Error marking progress:", error);
    throw error;
  }
}

// Get user's progress stats
export async function getQuestionProgress() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const progress = await db.questionProgress.findMany({
      where: { userId: user.id },
      include: { question: true },
    });

    const favorites = await db.favoriteQuestion.findMany({
      where: { userId: user.id },
    });

    const stats = {
      total: progress.length,
      mastered: progress.filter(p => p.status === "mastered").length,
      attempted: progress.filter(p => p.status === "attempted").length,
      notAttempted: progress.filter(p => p.status === "not-attempted").length,
      favorites: favorites.length,
      byCategory: {},
      byDifficulty: {},
    };

    // Count by category and difficulty
    progress.forEach(p => {
      const category = p.question.category;
      const difficulty = p.question.difficulty;

      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      stats.byDifficulty[difficulty] = (stats.byDifficulty[difficulty] || 0) + 1;
    });

    return { progress, stats, favorites };
  } catch (error) {
    console.error("Error fetching progress:", error);
    return {
      progress: [],
      stats: {
        total: 0,
        mastered: 0,
        attempted: 0,
        notAttempted: 0,
        favorites: 0,
        byCategory: {},
        byDifficulty: {},
      },
      favorites: [],
    };
  }
}

// Get favorite questions
export async function getFavoriteQuestions() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const favorites = await db.favoriteQuestion.findMany({
      where: { userId: user.id },
      include: { question: true },
      orderBy: { createdAt: "desc" },
    });

    return favorites.map(f => f.question);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
}

// Get questions for PDF export (by company)
export async function getQuestionsByCompanyForExport(company) {
  try {
    const questions = await db.interviewQuestion.findMany({
      where: { company },
      orderBy: [{ category: "asc" }, { difficulty: "asc" }],
    });

    if (questions.length === 0) {
      return getMockQuestions().filter(q => q.company === company);
    }

    return questions;
  } catch (error) {
    console.error("Error fetching questions for export:", error);
    return getMockQuestions().filter(q => q.company === company);
  }
}
