# 📚 AI Career Coach - Project Structure & File Explanation

## Project Overview
**AI Career Coach** is a full-stack web application that helps professionals build resumes, prepare for interviews, generate cover letters, and gain industry insights using AI (Google gemini).

**Tech Stack**: Next.js 16, React 19, PostgreSQL (Neon), Prisma ORM, Clerk Auth, Google gemini API, Tailwind CSS

---

## 📁 Folder & File Breakdown

### 🔧 Root Configuration Files

#### `package.json`
- **What**: Lists all project dependencies and scripts
- **Contains**: 
  - Dependencies: Next.js, React, Prisma, Clerk, Google Generative AI, Radix UI components
  - Scripts: `dev` (start development), `build`, `start`, `lint`
- **How to modify**: 
  - Add new packages: `npm install package-name`
  - Change scripts: Edit script commands
  - Update versions: Modify version numbers (then run `npm install`)

#### `next.config.mjs`
- **What**: Next.js configuration file
- **Contains**: Settings for how Next.js builds and runs the app
- **How to modify**: Add features like image optimization, redirects, API routes configuration

#### `jsconfig.json`
- **What**: JavaScript path aliases and compiler settings
- **Contains**: Path shortcuts (e.g., `@` might point to `src/`)
- **How to modify**: Add new path aliases if you create new directories

#### `tailwind.config.mjs`
- **What**: Tailwind CSS styling configuration
- **Contains**: Theme colors, spacing, fonts
- **How to modify**: Change colors, add new themes, adjust spacing values

#### `postcss.config.mjs`
- **What**: Post-processing CSS configuration
- **Contains**: Tailwind CSS plugin setup
- **How to modify**: Usually not needed, but can add other CSS plugins

#### `eslint.config.mjs`
- **What**: Code linting rules for quality checks
- **Contains**: Rules for code style and best practices
- **How to modify**: Enable/disable rules, add new rule sets

#### `components.json`
- **What**: shadcn/ui components configuration
- **Contains**: Settings for where UI components are imported from
- **How to modify**: Change component paths if you reorganize the components folder

#### `middleware.js`
- **What**: Next.js middleware for request handling
- **Contains**: Logic that runs before every request (auth checks, redirects)
- **How to modify**: Add authentication checks, request logging, etc.

---

### 📂 `app/` - Main Application (Next.js App Router)

This is the heart of the application using Next.js 16's App Router pattern.

#### `app/layout.js`
- **What**: Root layout for the entire application
- **Contains**: Global styles, providers, header/navigation that appear on all pages
- **How to modify**: Add global CSS, change theme provider, add analytics

#### `app/page.js`
- **What**: Homepage
- **Contains**: Landing page content
- **How to modify**: Change hero section, features display, testimonials

#### `app/globals.css`
- **What**: Global CSS styles
- **Contains**: Base styling, Tailwind imports, custom styles
- **How to modify**: Add custom CSS classes, adjust global colors, fonts

#### `app/not-found.jsx`
- **What**: 404 error page
- **Contains**: Page shown when user visits non-existent URL
- **How to modify**: Customize error message and styling

---

### 🔐 `app/(auth)/` - Authentication Routes

Enclosed in parentheses = doesn't appear in URL path

#### `app/(auth)/layout.js`
- **What**: Layout for auth pages (sign-in, sign-up)
- **Contains**: Auth-specific styling and layout
- **How to modify**: Change auth page styling, add watermarks/backgrounds

#### `app/(auth)/sign-in/[[...sign-in]]/page.jsx`
- **What**: Sign-in page
- **Contains**: Clerk authentication component for login
- **How to modify**: Customize Clerk sign-in appearance, add pre-login messaging

#### `app/(auth)/sign-up/[[...sign-up]]/page.jsx`
- **What**: Sign-up page
- **Contains**: Clerk authentication component for registration
- **How to modify**: Customize Clerk sign-up appearance, add terms/privacy

---

### 📊 `app/(main)/` - Main Application Pages

After login, users access these features

#### `app/(main)/layout.jsx`
- **What**: Layout for all main application pages
- **Contains**: Header/navigation, sidebar (if present)
- **How to modify**: Add/remove navigation items, change header styling

#### **Dashboard** - `app/(main)/dashboard/`
- **Purpose**: User's main dashboard showing statistics and overview
- `page.jsx`: Main dashboard view
- `_component/dashboard-view.jsx`: Reusable dashboard component
- **How to modify**: Change metrics displayed, add new stats, modify charts

#### **Resume Builder** - `app/(main)/resume/`
- **Purpose**: Create and manage resumes
- `page.jsx`: Main resume page
- `_components/resume-builder.jsx`: Resume form and builder
- `_components/entry-form.jsx`: Individual entry form (education, experience)
- **How to modify**: Add new resume sections, change form fields, add PDF export

#### **Interview Preparation** - `app/(main)/interview/`
- **Purpose**: Mock interviews and practice assessments
- `page.jsx`: Interview landing page
- `mock/page.jsx`: Mock interview quiz page
- `_components/quiz.jsx`: Quiz component for questions/answers
- `_components/quiz-result.jsx`: Shows quiz score and feedback
- `_components/quiz-list.jsx`: Lists available quizzes
- `_components/performace-chart.jsx`: Charts showing performance over time
- `_components/stats-cards.jsx`: Interview statistics cards
- **How to modify**: Change quiz difficulty, add new quiz categories, adjust scoring

#### **Cover Letter Generator** - `app/(main)/ai-cover-letter/`
- **Purpose**: Generate AI-powered cover letters
- `page.jsx`: Main cover letter page
- `new/page.jsx`: Create new cover letter page
- `[id]/page.jsx`: View/edit specific cover letter (dynamic route)
- `_components/cover-letter-generator.jsx`: AI generation form
- `_components/cover-letter-list.jsx`: Lists user's cover letters
- `_components/cover-letter-preview.jsx`: Displays generated letter
- **How to modify**: Change AI prompt, adjust formatting, add templates

#### **Onboarding** - `app/(main)/onboarding/`
- **Purpose**: First-time user setup
- `page.jsx`: Onboarding page
- `_components/onboarding-form.jsx`: Industry/skill selection form
- **How to modify**: Add more setup questions, change data collection, add tutorial steps

---

### 🌐 `app/api/` - Backend API Routes

#### `app/api/inngest/route.js`
- **What**: Inngest webhook handler
- **Contains**: Background job processing (sending emails, generating content)
- **How to modify**: Add new background jobs, change job triggers

---

### 📦 `actions/` - Server Actions (Next.js Feature)

Server-side functions called from client components (replaces traditional API routes)

#### `actions/user.js`
- **What**: User-related operations
- **Contains**: Update profile, get user data, edit settings
- **How to modify**: Add new user operations, change data updates

#### `actions/resume.js`
- **What**: Resume operations
- **Contains**: Create, update, delete, fetch resumes
- **How to modify**: Add validation, change storage logic, integrate ATS scoring

#### `actions/interview.js`
- **What**: Interview/quiz operations
- **Contains**: Create questions, save responses, calculate scores
- **How to modify**: Change quiz logic, add new question types, modify scoring

#### `actions/cover-letter.js`
- **What**: Cover letter operations
- **Contains**: Generate via AI, save, update, delete
- **How to modify**: Change AI prompt, adjust generation parameters, add new features

#### `actions/dashboard.js`
- **What**: Dashboard data operations
- **Contains**: Fetch user statistics, metrics, progress
- **How to modify**: Add new metrics, change calculation logic

---

### 📚 `components/` - Reusable React Components

#### `header.jsx`
- **What**: Application header/navbar
- **Contains**: Navigation, user menu, logo
- **How to modify**: Add new nav items, change styling, add search/notifications

#### `hero.jsx`
- **What**: Homepage hero section
- **Contains**: Main heading, call-to-action buttons
- **How to modify**: Change text, images, button actions

#### `theme-provider.jsx`
- **What**: Dark/light theme provider
- **Contains**: Theme switcher setup
- **How to modify**: Add new themes, change theme colors

#### `ui/` - UI Component Library
Pre-built reusable components (from shadcn/ui)
- `button.jsx`: Customizable button
- `card.jsx`: Card container
- `input.jsx`: Text input field
- `dialog.jsx`: Modal popup
- `select.jsx`: Dropdown selection
- `tabs.jsx`: Tab navigation
- `accordion.jsx`: Collapsible sections
- `alert-dialog.jsx`: Alert confirmation
- `textarea.jsx`: Multi-line text input
- `progress.jsx`: Progress bar
- `radio-group.jsx`: Radio button options
- `dropdown-menu.jsx`: Dropdown menu
- `label.jsx`: Form labels
- `badge.jsx`: Small labels/tags
- `sonner.jsx`: Toast notifications

**How to modify**: These are usually not modified. Use them in other components.

---

### 🔌 `hooks/` - Custom React Hooks

#### `use-fetch.js`
- **What**: Custom hook for data fetching
- **Contains**: Reusable fetch logic with loading/error states
- **How to modify**: Add caching, change error handling, add retry logic

---

### 🗄️ `lib/` - Utility Functions & Libraries

#### `checkUser.js`
- **What**: User verification logic
- **Contains**: Check if user exists, is authenticated
- **How to modify**: Add new user checks, change authentication logic

#### `prisma.js`
- **What**: Prisma database client initialization
- **Contains**: Database connection setup, singleton pattern
- **How to modify**: Usually not modified; change in `.env` file

#### `utils.js`
- **What**: General utility functions
- **Contains**: Helper functions like formatting, validation, etc.
- **How to modify**: Add new utility functions as needed

#### `inngest/`
- `client.js`: Inngest background job client
- `function.js`: Background job function definitions
- **What**: Background job processing setup
- **How to modify**: Add new background jobs, change job timing

---

### 🗃️ `prisma/` - Database Configuration

#### `schema.prisma`
- **What**: Database schema definition
- **Contains**: All data models (User, Resume, CoverLetter, Assessment, etc.)
- **Models**:
  - **User**: User profile, skills, industry
  - **Resume**: User's resume content and scores
  - **CoverLetter**: Generated cover letters
  - **Assessment**: Interview quiz results and scores
  - **IndustryInsight**: Industry-specific data
- **How to modify**: 
  1. Edit schema
  2. Run: `npx prisma migrate dev --name description`
  3. Deploy changes to database

#### `migrations/`
- **What**: Database version history
- **Contains**: SQL files for each schema change
- **How to modify**: Don't edit directly; let Prisma manage this

---

### 📊 `data/` - Static Data Files

#### `features.js`
- **What**: Feature list data
- **Contains**: Array of feature objects (title, description, icon)
- **How to modify**: Add/remove features, change descriptions

#### `testimonial.js`
- **What**: User testimonials
- **Contains**: Quotes, author info, ratings
- **How to modify**: Add/remove testimonials

#### `faqs.js`
- **What**: Frequently asked questions
- **Contains**: Question-answer pairs
- **How to modify**: Add/remove FAQ items, update answers

#### `howItWorks.js`
- **What**: Step-by-step process explanation
- **Contains**: Steps describing how the app works
- **How to modify**: Change steps, update descriptions

#### `industries.js`
- **What**: Industry list and subcategories
- **Contains**: Tech, Finance, Healthcare, etc. with sub-industries
- **How to modify**: Add/remove industries, adjust categories

---

### 🎨 `public/` - Static Assets

- **What**: Images, icons, fonts, and other static files
- **How to modify**: Add images/assets here and reference in code

---

## 🔄 How Data Flows Through the App

1. **User logs in** → Clerk authentication
2. **Onboarding** → User selects industry/skills (saved to DB)
3. **Resume Building** → User fills form → Saved to `Resume` table
4. **Interview Practice** → Quiz questions → Answers saved to `Assessment` table → AI feedback generated
5. **Cover Letter** → AI generates based on resume + job description → Saved to `CoverLetter` table
6. **Dashboard** → Shows aggregated stats from all tables

---

## 🔐 Environment Variables (.env.local)

You need to create `.env.local` with:
```
DATABASE_URL=your_postgresql_connection
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=from_clerk
CLERK_SECRET_KEY=from_clerk
GOOGLE_GENERATIVE_AI_API_KEY=from_google
INNGEST_EVENT_KEY=from_inngest
INNGEST_SIGNING_KEY=from_inngest
```

---

## 🚀 Running the App

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check code quality
```

---

## 📝 Common Modifications

### Add a New Feature
1. Create new folder in `app/(main)/feature-name/`
2. Create `page.jsx` for main page
3. Create components in `_components/`
4. Add server actions in `actions/feature.js`
5. Update `layout.jsx` navigation to include new feature

### Change AI Prompts
- Look in `actions/cover-letter.js` or `actions/interview.js`
- Find the prompt string and modify it
- Test the AI output

### Add New Database Fields
1. Edit `prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name field_name`
3. Use new field in server actions/components

### Customize UI
- Edit component files in `components/ui/`
- Change Tailwind classes in `tailwind.config.mjs`
- Add custom CSS in `app/globals.css`

---

## 📞 Need Help?

- Check the specific file you want to modify
- Follow the folder structure pattern
- Test changes in dev mode before production
- Use `npm run lint` to check for errors
