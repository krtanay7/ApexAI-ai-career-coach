"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Mock coding challenges data
const getMockChallenges = (language) => [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
    difficulty: "Easy",
    language: language || "JavaScript",
    category: "Arrays",
    starterCode: `function twoSum(nums, target) {
  // Write your code here
}`,
    solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    testCases: [
      { input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]", explanation: "nums[0] + nums[1] == 9" },
      { input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]", explanation: "nums[1] + nums[2] == 6" },
      { input: "nums = [3,3], target = 6", expectedOutput: "[0,1]", explanation: "nums[0] + nums[1] == 6" },
    ],
    hints: ["Use a hash map to store values and their indices", "For each number, check if complement exists in map"],
  },
  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "Easy",
    language: language || "JavaScript",
    category: "Strings",
    starterCode: `function isValid(s) {
  // Write your code here
}`,
    solution: `function isValid(s) {
  const stack = [];
  const mapping = { ')': '(', '}': '{', ']': '[' };
  
  for (let char of s) {
    if (mapping[char]) {
      if (!stack.length || stack.pop() !== mapping[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
    testCases: [
      { input: 's = "()"', expectedOutput: "true", explanation: "Simple valid parentheses" },
      { input: 's = "()[]{}"', expectedOutput: "true", explanation: "All types valid and balanced" },
      { input: 's = "(]"', expectedOutput: "false", explanation: "Mismatched parentheses" },
    ],
    hints: ["Use a stack to keep track of opening brackets", "Match closing brackets with the most recent opening bracket"],
  },
  {
    title: "Merge Sorted Array",
    description: "Merge two sorted integer arrays nums1 and nums2 into a single sorted array.",
    difficulty: "Easy",
    language: language || "JavaScript",
    category: "Arrays",
    starterCode: `function merge(nums1, m, nums2, n) {
  // Write your code here
}`,
    solution: `function merge(nums1, m, nums2, n) {
  let p1 = m - 1;
  let p2 = n - 1;
  let p = m + n - 1;
  
  while (p1 >= 0 && p2 >= 0) {
    if (nums1[p1] > nums2[p2]) {
      nums1[p] = nums1[p1];
      p1--;
    } else {
      nums1[p] = nums2[p2];
      p2--;
    }
    p--;
  }
  
  while (p2 >= 0) {
    nums1[p] = nums2[p2];
    p2--;
    p--;
  }
}`,
    testCases: [
      { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", expectedOutput: "[1,2,2,3,5,6]", explanation: "Merged and sorted" },
      { input: "nums1 = [1]", expectedOutput: "[1]", explanation: "Single element" },
    ],
    hints: ["Compare elements from the end of both arrays", "Work backwards to place elements in nums1"],
  },
  {
    title: "Binary Search",
    description: "Given a sorted array of integers, find the target value. Return its index if found, else return -1.",
    difficulty: "Medium",
    language: language || "JavaScript",
    category: "Searching",
    starterCode: `function search(nums, target) {
  // Write your code here
}`,
    solution: `function search(nums, target) {
  let left = 0, right = nums.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    testCases: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", expectedOutput: "4", explanation: "Target found at index 4" },
      { input: "nums = [-1,0,3,5,9,12], target = 13", expectedOutput: "-1", explanation: "Target not in array" },
    ],
    hints: ["Use binary search to achieve O(log n) time complexity", "Eliminate half of remaining elements at each step"],
  },
  {
    title: "Longest Substring Without Repeating Characters",
    description: "Find the length of the longest substring without repeating characters.",
    difficulty: "Medium",
    language: language || "JavaScript",
    category: "Strings",
    starterCode: `function lengthOfLongestSubstring(s) {
  // Write your code here
}`,
    solution: `function lengthOfLongestSubstring(s) {
  const charIndex = new Map();
  let maxLength = 0;
  let left = 0;
  
  for (let right = 0; right < s.length; right++) {
    if (charIndex.has(s[right])) {
      left = Math.max(left, charIndex.get(s[right]) + 1);
    }
    charIndex.set(s[right], right);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}`,
    testCases: [
      { input: 's = "abcabcbb"', expectedOutput: "3", explanation: '"abc" is longest' },
      { input: 's = "bbbbb"', expectedOutput: "1", explanation: '"b" is longest' },
      { input: 's = "pwwkew"', expectedOutput: "3", explanation: '"wke" is longest' },
    ],
    hints: ["Use sliding window with two pointers", "Use a map to track character positions"],
  },
];

export async function generateCodingChallenges(language = "JavaScript", difficulty = null) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    // For now, use mock challenges
    const mockChallenges = getMockChallenges(language);
    const filtered = difficulty
      ? mockChallenges.filter(c => c.difficulty === difficulty)
      : mockChallenges;

    // Save challenges to database
    const savedChallenges = [];
    for (const challenge of filtered) {
      const existing = await db.codingChallenge.findFirst({
        where: {
          userId: user.id,
          title: challenge.title,
          language: challenge.language,
        },
      });

      if (!existing) {
        const saved = await db.codingChallenge.create({
          data: {
            userId: user.id,
            title: challenge.title,
            description: challenge.description,
            difficulty: challenge.difficulty,
            language: challenge.language,
            category: challenge.category,
            starterCode: challenge.starterCode,
            solution: challenge.solution,
            testCases: challenge.testCases,
            hints: challenge.hints,
          },
        });
        savedChallenges.push(saved);
      }
    }

    return savedChallenges.length > 0 ? savedChallenges : filtered;
  } catch (error) {
    console.error("Error generating coding challenges:", error);
    return getMockChallenges(language);
  }
}

export async function getCodingChallenges(language = null, difficulty = null) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Check if db has codingChallenge model
    if (!db.codingChallenge) {
      const mockChallenges = getMockChallenges(language);
      return {
        challenges: mockChallenges,
        stats: { total: mockChallenges.length, solved: 0 }
      };
    }

    const where = { userId: user.id };
    if (language) where.language = language;
    if (difficulty) where.difficulty = difficulty;

    const challenges = await db.codingChallenge.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });

    // If no challenges exist, generate them
    if (challenges.length === 0) {
      return await generateCodingChallenges(language, difficulty);
    }

    return { challenges, stats: { total: challenges.length, solved: challenges.filter(c => c.status === "solved").length } };
  } catch (error) {
    console.error("Error fetching coding challenges:", error);
    // Return fallback mock data
    const mockChallenges = getMockChallenges(language);
    return {
      challenges: mockChallenges,
      stats: { total: mockChallenges.length, solved: 0, byDifficulty: { easy: 3, medium: 2, hard: 0 }, byLanguage: { "JavaScript": 5 } }
    };
  }
}

export async function submitChallengeCode(challengeId, code, testResults) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const challenge = await db.codingChallenge.findUnique({
    where: { id: challengeId },
  });

  if (!challenge || challenge.userId !== user.id) {
    throw new Error("Challenge not found");
  }

  // Count passed tests
  const passedTests = testResults.filter(r => r.passed).length;
  const allPassed = passedTests === testResults.length;

  const update = {
    userCode: code,
    submissions: challenge.submissions + 1,
    passed: allPassed ? challenge.passed + 1 : challenge.passed,
    status: allPassed ? "solved" : "attempted",
  };

  const updated = await db.codingChallenge.update({
    where: { id: challengeId },
    data: update,
  });

  return {
    ...updated,
    testResults,
    passed: allPassed,
    passedTests,
    totalTests: testResults.length,
  };
}

export async function getChallengeProgress() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Check if db has codingChallenge model
    if (!db.codingChallenge) {
      return {
        challenges: getMockChallenges(),
        stats: {
          total: 5,
          solved: 0,
          attempted: 0,
          notStarted: 5,
          byDifficulty: { easy: 3, medium: 2, hard: 0 },
          byLanguage: { "JavaScript": 5 },
          totalSubmissions: 0,
        }
      };
    }

    const challenges = await db.codingChallenge.findMany({
      where: { userId: user.id },
    });

    const stats = {
      total: challenges.length,
      solved: challenges.filter(c => c.status === "solved").length,
      attempted: challenges.filter(c => c.status === "attempted").length,
      notStarted: challenges.filter(c => c.status === "not-started").length,
      byDifficulty: {
        easy: challenges.filter(c => c.difficulty === "Easy").length,
        medium: challenges.filter(c => c.difficulty === "Medium").length,
        hard: challenges.filter(c => c.difficulty === "Hard").length,
      },
      byLanguage: {},
      totalSubmissions: challenges.reduce((sum, c) => sum + c.submissions, 0),
    };

    // Count by language
    challenges.forEach(c => {
      stats.byLanguage[c.language] = (stats.byLanguage[c.language] || 0) + 1;
    });

    return { challenges, stats };
  } catch (error) {
    console.error("Error fetching challenge progress:", error);
    return {
      challenges: getMockChallenges(),
      stats: {
        total: 5,
        solved: 0,
        attempted: 0,
        notStarted: 5,
        byDifficulty: { easy: 3, medium: 2, hard: 0 },
        byLanguage: { "JavaScript": 5 },
        totalSubmissions: 0,
      }
    };
  }
}

export async function getHints(challengeId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const challenge = await db.codingChallenge.findUnique({
    where: { id: challengeId },
  });

  if (!challenge) throw new Error("Challenge not found");

  return challenge.hints || [];
}
