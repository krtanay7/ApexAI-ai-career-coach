# 🚀 AI Career Coach

> **An AI-powered career development platform that helps professionals build resumes, prepare for interviews, generate cover letters, and gain industry insights.**

[![GitHub](https://img.shields.io/badge/GitHub-riteshbhai70-blue?logo=github)](https://github.com/riteshbhai70)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791)](https://neon.tech)
[![License](https://img.shields.io/badge/License-MIT-green)](#license)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Database Schema](#-database-schema)
- [API & Server Actions](#-api--server-actions)
- [Key Features Explained](#-key-features-explained)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**AI Career Coach** is a full-stack web application designed to revolutionize career development. It leverages cutting-edge AI technology to provide personalized guidance, intelligent content generation, and comprehensive career analytics.

### Problem It Solves
- **Resume Building**: Creating effective resumes is time-consuming and requires expertise
- **Interview Preparation**: Lack of personalized practice opportunities
- **Cover Letter Writing**: Generic or poorly tailored cover letters reduce chances of landing interviews
- **Career Insights**: Users struggle to understand industry demands and career paths

### Solution
An intelligent platform that uses **Google gemini AI** to generate customized, industry-aware content while providing actionable insights for career growth.

---

## ✨ Features

### 🎓 Core Features

| Feature | Description | Technology |
|---------|-------------|-----------|
| **User Authentication** | Secure sign-up/sign-in with Clerk | Clerk Auth |
| **Resume Builder** | Drag-and-drop resume creation with AI improvements | React Hook Form + gemini AI |
| **Interview Preparation** | AI-generated technical interview questions | gemini Flash 2.5 |
| **Cover Letter Generator** | Context-aware cover letters tailored to job descriptions | gemini AI |
| **Industry Analytics** | Real-time salary ranges, market trends, in-demand skills | gemini + Inngest |
| **Performance Tracking** | Quiz results, progress charts, improvement tips | Recharts + Prisma |
| **Profile Management** | Onboarding, skill tracking, industry selection | Clerk + Prisma |

### 🤖 AI Capabilities

- **Dynamic Content Generation**: Generates context-aware resumes, cover letters, and interview questions
- **Improvement Suggestions**: AI-powered enhancements for resume content using industry best practices
- **Industry Insights**: Analyzes salary trends, growth rates, top skills, and market outlook
- **Personalized Tips**: Provides targeted improvement feedback based on quiz performance

---

## 💻 Tech Stack

### **Frontend**
```
Framework:        Next.js 16.1.4
Language:         JavaScript (JSX)
UI Library:       React 19.2.3
Styling:          Tailwind CSS 3.4.1
Components:       Shadcn/ui (Radix UI)
Form Handling:    React Hook Form 7.54.2 + Zod 3.24.1
State Management: React Context + Custom Hooks
Charts:           Recharts 2.15.0
Icons:            Lucide React 0.471.2
Theme:            Next Themes 0.4.6
Markdown Editor:  React Markdown 9.0.3 + @uiw/react-md-editor 4.0.5
Notifications:    Sonner 1.7.1
PDF Export:       html2pdf.js 0.10.2
Loading:          React Spinners 0.15.0
```

### **Backend**
```
Runtime:          Node.js (via Next.js)
Server Framework: Next.js App Router
Database:         PostgreSQL (Neon)
ORM:              Prisma 6.2.1
Authentication:   Clerk 6.9.10
Job Queue:        Inngest 3.29.3
AI Model:         Google gemini 2.5 Flash
HTTP Client:      Built-in fetch API
Caching:          Next.js Revalidation
```

### **Database**
```
Provider:         PostgreSQL (via Neon)
ORM:              Prisma 6.2.1
Migration:        Prisma Migrations
Schema:           TypeScript-based (schema.prisma)
```

### **Development Tools**
```
Build Tool:       Next.js Turbopack
Linting:          ESLint 9
Configuration:    JavaScript Config (jsconfig.json)
CSS Processing:   PostCSS 8
Code Quality:     Tailwind CSS + Custom Rules
```

### **Deployment Ready**
```
Hosting:          Vercel (Next.js optimized)
Database:         Neon PostgreSQL
Authentication:   Clerk (serverless)
Background Jobs:  Inngest (serverless)
CDN:              Vercel Edge Network
```

---

## 🏗️ Architecture

### **System Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (React)                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Dashboard │ Resume │ Interview │ Cover Letter    │  │
│  │           │ Builder │ Quiz     │ Generator       │  │
│  └──────────────────────────────────────────────────┘  │
│              ↓ (HTTP/Server Actions)                    │
├─────────────────────────────────────────────────────────┤
│              NEXT.JS SERVER LAYER                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Server Actions (AI, Auth, Data Operations)       │  │
│  │ ├─ User Management     (Clerk Integration)       │  │
│  │ ├─ Resume Operations   (DB + AI)                 │  │
│  │ ├─ Interview Logic     (AI + DB)                 │  │
│  │ ├─ Cover Letter Gen    (AI + DB)                 │  │
│  │ └─ Dashboard Analytics (Insights)                │  │
│  └──────────────────────────────────────────────────┘  │
│              ↓ (Prisma ORM)                             │
├─────────────────────────────────────────────────────────┤
│              BACKGROUND JOBS (Inngest)                  │
│  ├─ Weekly Industry Insight Updates (Cron: Sun 00:00)  │
│  └─ Batch AI Content Generation                        │
├─────────────────────────────────────────────────────────┤
│              EXTERNAL SERVICES                          │
│  ├─ Google gemini AI (Content Generation)              │
│  ├─ Clerk Auth (User Management)                       │
│  └─ Neon PostgreSQL (Data Persistence)                 │
├─────────────────────────────────────────────────────────┤
│              DATABASE LAYER (Prisma)                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Users │ Assessments │ Resumes │ CoverLetters     │  │
│  │       │ IndustryInsights                         │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### **Data Flow**

```
1. USER AUTHENTICATION
   User → Clerk Auth → Create/Fetch User in DB

2. PROFILE SETUP
   User → Onboarding Form → Save Profile → Generate Industry Insights (AI)

3. RESUME CREATION
   User → Resume Editor → Save to DB → Request AI Improvement → Display

4. INTERVIEW PREP
   User → Request Quiz → AI Generates Questions → Save to DB → Display Results

5. COVER LETTER
   User → Input Job Details → AI Generates Letter → Save to DB

6. INDUSTRY INSIGHTS
   User → View Dashboard → Fetch Latest Insights → Display Analytics
   (Background: Weekly Cron Job → Update All Industries via AI)
```

---

## 🚀 Installation

### **Prerequisites**

- Node.js 18+ or higher
- npm/yarn package manager
- PostgreSQL database (or Neon account for cloud hosting)
- Google gemini API key
- Clerk account for authentication

### **Step 1: Clone Repository**

```bash
git clone https://github.com/riteshbhai70/ai-career-coach.git
cd ai-career-coach
```

### **Step 2: Install Dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

### **Step 3: Generate Prisma Client**

```bash
npx prisma generate
```

### **Step 4: Create Environment Variables**

Create a `.env` file in the root directory (see [Environment Setup](#-environment-setup))

### **Step 5: Setup Database**

```bash
# Run migrations
npx prisma migrate dev

# (Optional) Seed database with sample data
npx prisma db seed
```

### **Step 6: Run Development Server**

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see your application.

---

## 🔐 Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# ==========================================
# DATABASE CONFIGURATION (Neon PostgreSQL)
# ==========================================
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# ==========================================
# CLERK AUTHENTICATION
# ==========================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_key_here"
CLERK_SECRET_KEY="sk_test_your_secret_here"

# Clerk URLs for redirects
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# ==========================================
# GOOGLE gemini AI API
# ==========================================
gemini_API_KEY="your_gemini_api_key_here"

# ==========================================
# INNGEST (Background Jobs)
# ==========================================
INNGEST_KEY="optional_if_using_inngest"
INNGEST_EVENT_KEY="optional_for_inngest_events"
```

### **How to Get These Keys:**

1. **DATABASE_URL**: 
   - Sign up at [Neon.tech](https://neon.tech)
   - Create a project and copy the connection string

2. **CLERK Keys**:
   - Go to [clerk.com](https://clerk.com)
   - Create an application
   - Copy publishable and secret keys

3. **gemini_API_KEY**:
   - Visit [Google AI Studio](https://ai.google.dev)
   - Create API key for gemini

4. **INNGEST** (Optional):
   - Register at [inngest.com](https://inngest.com)
   - Create function and get signing key

---

## 📁 Project Structure

```
ai-career-coach/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.js                # Root layout
│   ├── page.js                  # Landing page
│   ├── not-found.jsx            # 404 page
│   ├── (auth)/                  # Authentication routes (private)
│   │   ├── layout.js
│   │   ├── sign-in/[[...sign-in]]/page.jsx
│   │   └── sign-up/[[...sign-up]]/page.jsx
│   ├── (main)/                  # Main app routes (protected)
│   │   ├── layout.jsx           # Main app layout with header
│   │   ├── dashboard/           # Dashboard with analytics
│   │   │   ├── page.jsx
│   │   │   └── _component/
│   │   │       └── dashboard-view.jsx
│   │   ├── resume/              # Resume builder
│   │   │   ├── page.jsx
│   │   │   └── _components/
│   │   │       ├── resume-builder.jsx
│   │   │       └── entry-form.jsx
│   │   ├── interview/           # Interview preparation
│   │   │   ├── page.jsx
│   │   │   ├── mock/page.jsx
│   │   │   └── _components/
│   │   │       ├── quiz.jsx
│   │   │       ├── quiz-list.jsx
│   │   │       ├── quiz-result.jsx
│   │   │       ├── performace-chart.jsx
│   │   │       └── stats-cards.jsx
│   │   ├── ai-cover-letter/     # Cover letter generator
│   │   │   ├── page.jsx
│   │   │   ├── new/page.jsx
│   │   │   ├── [id]/page.jsx
│   │   │   └── _components/
│   │   │       ├── cover-letter-generator.jsx
│   │   │       ├── cover-letter-list.jsx
│   │   │       └── cover-letter-preview.jsx
│   │   └── onboarding/          # User onboarding
│   │       ├── page.jsx
│   │       └── _components/
│   │           └── onboarding-form.jsx
│   └── api/
│       └── inngest/route.js     # Inngest webhook endpoint
│
├── actions/                      # Server Actions
│   ├── user.js                  # User management (profile, onboarding)
│   ├── dashboard.js             # Industry insights generation
│   ├── resume.js                # Resume creation & AI improvements
│   ├── interview.js             # Quiz generation & results
│   └── cover-letter.js          # Cover letter generation
│
├── components/                   # React Components
│   ├── header.jsx               # Navigation header
│   ├── hero.jsx                 # Landing page hero
│   ├── theme-provider.jsx       # Dark/light theme provider
│   └── ui/                      # Shadcn UI components
│       ├── button.jsx
│       ├── card.jsx
│       ├── dialog.jsx
│       ├── input.jsx
│       ├── textarea.jsx
│       ├── tabs.jsx
│       ├── accordion.jsx
│       ├── badge.jsx
│       ├── progress.jsx
│       ├── select.jsx
│       ├── radio-group.jsx
│       ├── dropdown-menu.jsx
│       ├── alert-dialog.jsx
│       └── sonner.jsx           # Toast notifications
│
├── hooks/                        # Custom React Hooks
│   └── use-fetch.js             # Fetch data hook
│
├── lib/                         # Utility functions
│   ├── utils.js                 # General utilities
│   ├── checkUser.js             # User existence check
│   ├── helper.js                # Helper functions
│   ├── prisma.js                # Prisma client singleton
│   ├── schema.js                # Zod validation schemas
│   └── inngest/
│       ├── client.js            # Inngest client
│       └── function.js          # Background job functions
│
├── prisma/                      # Database configuration
│   ├── schema.prisma            # Database schema
│   ├── migrations/              # Migration history
│   └── migration_lock.toml      # Migration lock file
│
├── data/                        # Static data
│   ├── features.js              # Landing page features
│   ├── faqs.js                  # FAQ section
│   ├── howItWorks.js            # How it works section
│   ├── industries.js            # Industry list
│   └── testimonial.js           # Testimonials
│
├── public/                      # Static assets
│
├── config files
│   ├── next.config.mjs          # Next.js configuration
│   ├── tailwind.config.mjs      # Tailwind CSS config
│   ├── postcss.config.mjs       # PostCSS config
│   ├── jsconfig.json            # JS path aliases
│   ├── eslint.config.mjs        # ESLint rules
│   ├── components.json          # Shadcn UI config
│   ├── middleware.js            # Next.js middleware (Clerk)
│   └── package.json             # Dependencies & scripts
│
└── .env                         # Environment variables (create this)
```

---

## 🔄 How It Works

### **1. User Authentication Flow**

```
User visits /sign-up
    ↓
Clerk handles signup (email/password/OAuth)
    ↓
Clerk creates Clerk user ID
    ↓
User redirected to /onboarding
    ↓
Middleware checks if user exists in DB
    ↓
Create new User record in Prisma DB
    ↓
Save profile info (industry, skills, experience)
    ↓
Auto-generate industry insights via AI
    ↓
Redirect to /dashboard
```

### **2. Resume Building Flow**

```
User navigates to /resume
    ↓
Fetch existing resume from DB (if any)
    ↓
Display resume builder interface
    ↓
User adds work experience via entry-form
    ↓
On submit, user can request AI improvement
    ↓
Server action calls gemini AI with:
   - User's current content
   - User's industry & skills
   - Resume writing best practices
    ↓
AI returns improved version with:
   - Action verbs
   - Quantifiable metrics
   - Industry keywords
    ↓
User reviews and saves to DB
    ↓
Content stored in PostgreSQL via Prisma
```

### **3. Interview Preparation Flow**

```
User clicks "Start Interview Quiz"
    ↓
Server action fetch user details:
   - Industry
   - Skills
   - Experience
    ↓
Call gemini AI with prompt:
   "Generate 10 technical questions for [industry]"
    ↓
AI returns JSON array of questions with:
   - Question text
   - 4 multiple-choice options
   - Correct answer
   - Explanation
    ↓
Frontend displays questions one-by-one
    ↓
User selects answers
    ↓
OnSubmit: calculate score
    ↓
For each wrong answer, request AI improvement tip
    ↓
Save Assessment record to DB:
   - Questions & user answers
   - Score
   - Improvement tips
   - Timestamp
    ↓
Display results with charts showing progress
```

### **4. Cover Letter Generation Flow**

```
User navigates to /ai-cover-letter/new
    ↓
Form collects:
   - Company name
   - Job title
   - Job description
    ↓
User submits form
    ↓
Server action constructs AI prompt:
   - User's industry, skills, experience
   - Job title and company info
   - Job description content
    ↓
gemini AI generates professional letter:
   - Professional tone
   - Relevant skills highlighted
   - Company-specific details
   - Max 400 words
   - Markdown formatted
    ↓
Save to DB with status "completed"
    ↓
Display preview with edit capability
    ↓
User can download as PDF or save draft
```

### **5. Industry Insights Flow**

**On-Demand (Dashboard Load):**
```
User views /dashboard
    ↓
Check if user has industryInsight in DB
    ↓
If not exists:
   - Call generateAIInsights()
   - Pass user's industry to gemini
    ↓
gemini returns JSON with:
   - Salary ranges (5+ roles)
   - Growth rate (%)
   - Demand level (High/Med/Low)
   - Top skills
   - Market outlook
   - Key trends
    ↓
Create IndustryInsight record in DB
    ↓
Display on dashboard with charts
```

**Scheduled (Weekly Background Job via Inngest):**
```
Every Sunday at 00:00 UTC:
    ↓
Inngest triggers function
    ↓
Fetch all industries from DB
    ↓
For each industry:
   - Call gemini with latest prompt
   - Get fresh insights
   - Update DB record
   - Set nextUpdate to +7 days
    ↓
Complete
```

---

## 📊 Database Schema

### **User Model**
```typescript
User {
  id: String @id
  clerkUserId: String @unique
  email: String @unique
  name: String?
  imageUrl: String?
  industry: String?
  bio: String?
  experience: Int?
  skills: String[]
  createdAt: DateTime
  updatedAt: DateTime
  
  // Relations
  industryInsight: IndustryInsight?
  assessments: Assessment[]
  resume: Resume?
  coverLetters: CoverLetter[]
}
```

### **Assessment Model**
```typescript
Assessment {
  id: String @id
  userId: String
  quizScore: Float
  questions: Json[]  // Array of Q&A objects
  category: String   // "Technical", "Behavioral"
  improvementTip: String?
  createdAt: DateTime
  updatedAt: DateTime
  
  // Relations
  user: User
}
```

### **Resume Model**
```typescript
Resume {
  id: String @id
  userId: String @unique
  content: String @db.Text
  atsScore: Float?
  feedback: String?
  createdAt: DateTime
  updatedAt: DateTime
  
  // Relations
  user: User
}
```

### **CoverLetter Model**
```typescript
CoverLetter {
  id: String @id
  userId: String
  content: String
  jobDescription: String?
  companyName: String
  jobTitle: String
  status: String  // "draft" | "completed"
  createdAt: DateTime
  updatedAt: DateTime
  
  // Relations
  user: User
}
```

### **IndustryInsight Model**
```typescript
IndustryInsight {
  id: String @id
  industry: String @unique
  salaryRanges: Json[]
  growthRate: Float
  demandLevel: String
  topSkills: String[]
  marketOutlook: String
  keyTrends: String[]
  recommendedSkills: String[]
  lastUpdated: DateTime
  nextUpdate: DateTime
  
  // Relations
  users: User[]
}
```

---

## 🔧 API & Server Actions

### **User Actions** (`actions/user.js`)

```typescript
// Update user profile and generate industry insights
updateUser(data: {
  industry: string
  experience: number
  bio: string
  skills: string[]
}) → User

// Check if user completed onboarding
getUserOnboardingStatus() → User

// Fetch all user data
getUser() → User with relations
```

### **Resume Actions** (`actions/resume.js`)

```typescript
// Save or update resume
saveResume(content: string) → Resume

// Fetch user's resume
getResume() → Resume

// Improve specific section with AI
improveWithAI(params: {
  current: string
  type: "summary" | "experience" | "education"
}) → string (improved content)
```

### **Interview Actions** (`actions/interview.js`)

```typescript
// Generate 10 AI interview questions
generateQuiz() → Question[]

// Save quiz result with AI feedback
saveQuizResult(
  questions: Question[],
  answers: string[],
  score: number
) → Assessment

// Fetch user's quiz history
getAssessments() → Assessment[]

// Get specific assessment
getAssessment(id: string) → Assessment
```

### **Cover Letter Actions** (`actions/cover-letter.js`)

```typescript
// Generate cover letter with AI
generateCoverLetter(data: {
  jobTitle: string
  companyName: string
  jobDescription: string
}) → CoverLetter

// Get all user's cover letters
getCoverLetters() → CoverLetter[]

// Get specific cover letter
getCoverLetter(id: string) → CoverLetter

// Update cover letter
updateCoverLetter(id: string, content: string) → CoverLetter
```

### **Dashboard Actions** (`actions/dashboard.js`)

```typescript
// Generate industry insights with AI
generateAIInsights(industry: string) → IndustryInsight

// Get or create industry insights
getIndustryInsights() → IndustryInsight
```

---

## ✨ Key Features Explained

### **🎯 AI Content Generation**

All AI features use **Google gemini 2.5 Flash** model:
- Fast inference (real-time responses)
- Cost-effective
- Supports structured JSON output
- Excellent for career guidance content

**Process:**
1. Collect context (user profile, job details, etc.)
2. Construct detailed prompt with instructions
3. Call gemini API with structured output request
4. Parse JSON response
5. Store in database
6. Display to user

### **📊 Performance Tracking**

- **Quiz Results**: Stores every question, answer, and score
- **Charts**: Visualize score progression over time (Recharts)
- **Improvement Tips**: AI-generated personalized feedback
- **Analytics**: Overall stats cards showing averages and trends

### **🔄 Auto-Updating Industry Data**

Using **Inngest** for background jobs:
- **Cron Schedule**: Every Sunday at midnight UTC
- **Process**: Fetches all industries → Calls gemini for fresh data → Updates DB
- **Data**: Salary ranges, trends, skills, market outlook
- **Benefits**: Users always see current industry insights

### **🔐 Security & Authentication**

- **Clerk Integration**: Enterprise-grade authentication
- **Server Actions**: All sensitive operations run on server
- **Auth Checks**: Every action verifies user identity
- **Database**: Prisma prevents SQL injection
- **Environment Variables**: Secrets never exposed to client

### **🎨 UI/UX**

- **Responsive Design**: Works on mobile, tablet, desktop
- **Dark Mode**: Theme switcher using Next Themes
- **Accessibility**: Shadcn/ui components follow WCAG standards
- **Real-time Feedback**: Sonner toast notifications
- **Loading States**: React Spinners for async operations
- **Form Validation**: Zod schemas with client & server validation

---

## 📦 Key Dependencies & Why They're Used

| Package | Version | Purpose |
|---------|---------|---------|
| `@clerk/nextjs` | 6.9.10 | Enterprise authentication with OAuth support |
| `@google/generative-ai` | 0.21.0 | Google gemini API client for AI features |
| `@prisma/client` | 6.2.1 | Type-safe database ORM |
| `react-hook-form` | 7.54.2 | Efficient form state management |
| `zod` | 3.24.1 | TypeScript-first schema validation |
| `recharts` | 2.15.0 | Beautiful charts for analytics |
| `inngest` | 3.29.3 | Background job scheduling |
| `react-markdown` | 9.0.3 | Render markdown content in UI |
| `html2pdf.js` | 0.10.2 | Export resumes to PDF |
| `tailwindcss` | 3.4.1 | Utility-first CSS framework |
| `@radix-ui/*` | Various | Accessible component primitives |
| `sonner` | 1.7.1 | Beautiful toast notifications |
| `next-themes` | 0.4.6 | Dark/light theme management |

---

## 🚀 Available Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run lint            # Run ESLint
npm run build           # Build for production
npm run start           # Start production server

# Database
npx prisma migrate dev  # Run migrations
npx prisma studio      # Open Prisma Studio (database GUI)
npx prisma generate    # Generate Prisma client

# Deployment
npm run build           # Optimize for Vercel
npm run start           # Production server
```

---

## 🌐 Deployment

### **Best Practices for Production:**

1. **Database**: Use Neon PostgreSQL for reliability
2. **Hosting**: Deploy to Vercel for optimal Next.js performance
3. **Environment Variables**: Use Vercel's secure environment variable management
4. **CDN**: Leverage Vercel's Edge Network
5. **Monitoring**: Set up error tracking (Sentry recommended)
6. **Backups**: Enable Neon's automated backups

### **Deployment Steps:**

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect repository to Vercel
# - Go to vercel.com
# - Connect GitHub account
# - Select repository
# - Add environment variables
# - Deploy!

# 3. Verify deployment
# - Check Vercel dashboard
# - Test all features
# - Monitor logs
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Make your changes
4. Commit: `git commit -m 'Add AmazingFeature'`
5. Push: `git push origin feature/AmazingFeature`
6. Open Pull Request

### **Development Guidelines:**
- Follow ESLint rules
- Write descriptive commit messages
- Test changes locally before pushing
- Update README for significant changes
- Add proper error handling
- Use TypeScript where possible

---

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma ORM Guide](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Clerk Auth](https://clerk.com/docs)
- [Google gemini API](https://ai.google.dev/docs)
- [Inngest Background Jobs](https://www.inngest.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 👨‍💻 Author

**Ritesh Kumar**
- GitHub: [@riteshbhai70](https://github.com/riteshbhai70)
- Building AI-powered solutions for career development

---

## 🙏 Acknowledgments

- Google for gemini AI API
- Clerk for authentication
- Neon for PostgreSQL hosting
- Vercel for hosting & deployment
- Shadcn for beautiful UI components
- Inngest for background job orchestration

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues first
- Provide detailed descriptions
- Include error logs and screenshots

---

**Made with ❤️ by [riteshbhai70](https://github.com/riteshbhai70)**
