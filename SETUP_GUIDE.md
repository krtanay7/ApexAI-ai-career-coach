# 🚀 AI Career Coach - Complete Setup Guide for Your Friend

This guide walks through everything needed to set up and run the AI Career Coach project from scratch on a new computer.

---

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [What to Download & Install](#what-to-download--install)
3. [Create Required Accounts](#create-required-accounts)
4. [Clone the Repository](#clone-the-repository)
5. [Environment Setup](#environment-setup)
6. [Install Dependencies](#install-dependencies)
7. [Database Setup](#database-setup)
8. [Run the Project](#run-the-project)
9. [Troubleshooting](#troubleshooting)

---

## 💻 System Requirements

- **Windows 10+**, **macOS 10.15+**, or **Linux**
- **RAM**: 4GB minimum (8GB recommended)
- **Internet Connection**: Required for API keys and dependencies

---

## 📥 What to Download & Install

### 1. **Node.js & NPM**

Node.js is required to run the project.

**Download from**: https://nodejs.org/

**Steps**:
1. Go to https://nodejs.org/
2. Download **LTS (Long Term Support)** version
3. Run the installer and follow the setup wizard
4. Check "Add to PATH" during installation
5. Restart your computer after installation

**Verify Installation**:
```bash
node --version
npm --version
```

Both should show version numbers (e.g., v18.0.0, 8.0.0)

---

### 2. **Git** (Optional but Recommended)

Git helps clone the repository easily.

**Download from**: https://git-scm.com/

**Steps**:
1. Go to https://git-scm.com/
2. Download the installer for your OS
3. Run installer with default settings
4. Restart your computer

**Verify Installation**:
```bash
git --version
```

---

### 3. **Code Editor** (Optional)

Use **Visual Studio Code** for the best experience.

**Download from**: https://code.visualstudio.com/

**Steps**:
1. Go to https://code.visualstudio.com/
2. Download for your OS
3. Install normally
4. Open the project folder with VS Code

---

## 🔑 Create Required Accounts

You'll need 3 online accounts (all free with free tier options):

### 1. **Neon PostgreSQL Database** ✅

This is where the app stores user data.

**Steps**:
1. Go to https://neon.tech/
2. Click "Sign Up" → Use Google or GitHub
3. Create a new project
4. Copy the connection string (looks like: `postgresql://user:password@host:5432/dbname`)
5. Save this for later (you'll need it in `.env`)

### 2. **Google gemini API Key** 🤖

This powers the AI features for interview questions.

**Steps**:
1. Go to https://aistudio.google.com/app/apikeys
2. Click "Create API Key"
3. Select or create a Google Cloud project
4. Copy the API key
5. Save this for later (you'll need it in `.env`)

### 3. **Clerk Authentication** 🔐

This handles user login and signup.

**Steps**:
1. Go to https://dashboard.clerk.com/
2. Click "Sign Up" → Use Google or Email
3. Create a new application
4. Choose "Next.js" as your framework
5. Copy these keys from the dashboard:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
6. Save these for later (you'll need them in `.env`)

---

## 📂 Clone the Repository

### Option 1: Using Git (Recommended)

**Steps**:
1. Open Command Prompt or PowerShell
2. Navigate to where you want the project:
   ```bash
   cd Desktop
   ```
3. Clone the repository:
   ```bash
   git clone https://github.com/YOUR-GITHUB-USERNAME/ai-career-coach.git
   ```
   *(Replace with the actual repository URL)*

4. Enter the project folder:
   ```bash
   cd ai-career-coach
   ```

### Option 2: Manual Download (Without Git)

**Steps**:
1. Go to the repository on GitHub
2. Click **Code** → **Download ZIP**
3. Extract the ZIP file to your desired location
4. Open the extracted folder in Command Prompt

---

## 🛑 Delete Existing Files (If Reusing Old Code)

If there's already code in the folder, delete these before starting:

```bash
# Delete node_modules folder (reinstall fresh)
rmdir /s node_modules

# Delete package-lock.json (reinstall dependencies)
del package-lock.json

# Delete .env file (create a new one)
del .env
del .env.local
del .env.example

# Delete .next build folder (rebuild)
rmdir /s .next

# Delete Prisma migrations folder (optional, for clean database)
# This is dangerous - only delete if you want a fresh database!
rmdir /s prisma\migrations
```

---

## 🔧 Environment Setup

Create a `.env` file in the project root folder with all the API keys.

**Steps**:

1. In the project folder, create a new file named `.env` (no extension)
   
   *(In VS Code: Right-click → New File → name it `.env`)*

2. Copy this template and fill in your actual values:

```env
# Database Connection (from Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# gemini AI API Key (from Google)
gemini_API_KEY="your_gemini_api_key_here"

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_publishable_key"
CLERK_SECRET_KEY="sk_test_your_clerk_secret_key"

# Clerk URLs (copy these exactly as shown)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_REDIRECT_URL=/onboarding

# App Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Important Notes**:
- ⚠️ **Never** commit `.env` to GitHub (add to `.gitignore`)
- ⚠️ **Keep API keys secret** - don't share them
- ⚠️ **Database URL** is the most critical piece
- ⚠️ **Clerk keys** must be exactly as shown in your Clerk dashboard

---

## 📦 Install Dependencies

Dependencies are libraries the project needs to run.

**Steps**:

1. Open Command Prompt/PowerShell in the project folder
2. Run:
   ```bash
   npm install
   ```

   This will:
   - Create a `node_modules` folder (takes 2-5 minutes)
   - Download ~500+ packages
   - Show completion message when done

3. Verify installation (should show the project structure):
   ```bash
   npm list
   ```

---

## 🗄️ Database Setup

Initialize the database schema using Prisma.

**Steps**:

1. In the project folder, run:
   ```bash
   npx prisma migrate deploy
   ```

   This will:
   - Connect to your Neon database
   - Create all required tables
   - Show "Applied migrations" when done

2. (Optional) View the database:
   ```bash
   npx prisma studio
   ```
   This opens a web UI to see your database

---

## 🚀 Run the Project

Now everything is set up! Start the development server.

**Steps**:

1. In the project folder, run:
   ```bash
   npm run dev
   ```

2. You should see output like:
   ```
   ▲ Next.js 16.1.4
   - Local:         http://localhost:3000
   - Network:       http://192.168.x.x:3000
   ```

3. **Open your browser** and go to: **http://localhost:3000**

4. The app should load with the home page! ✅

---

## 🎯 First Time Setup Checklist

- [ ] Node.js installed (check with `node --version`)
- [ ] Neon PostgreSQL account created with database URL
- [ ] Google gemini API key obtained
- [ ] Clerk account created with API keys
- [ ] `.env` file created with all keys
- [ ] Project cloned/downloaded
- [ ] `npm install` completed
- [ ] `npx prisma migrate deploy` completed
- [ ] `npm run dev` running
- [ ] App loads at http://localhost:3000

---

## 💡 Using the App

Once running at http://localhost:3000:

1. **Sign Up**: Create an account using Clerk
2. **Onboarding**: Fill in your profile (skills, industry, etc.)
3. **Resume Builder**: Create your resume with the app
4. **Cover Letter**: Generate AI-powered cover letters
5. **Interview Prep**: Get job-specific interview questions
6. **Assessments**: Take quizzes and track progress

---

## 🐛 Troubleshooting

### Issue: "Port 3000 is already in use"

**Solution**:
```bash
# Kill the process using port 3000
taskkill /F /IM node.exe

# Or use a different port
npm run dev -- -p 3001
```

### Issue: "DATABASE_URL is undefined"

**Solution**:
- Check `.env` file exists in project root
- Verify `DATABASE_URL` is set correctly
- Restart the dev server after updating `.env`

### Issue: "API key error" or "Unauthorized"

**Solution**:
- Check all API keys in `.env` are correct (copy-paste carefully)
- Verify keys are enabled in respective dashboards
- Make sure keys match the environment (test vs production)

### Issue: "npm: command not found"

**Solution**:
- Node.js not installed or PATH not set
- Restart your computer after installing Node.js
- Verify with `node --version`

### Issue: "Cannot find module" errors

**Solution**:
```bash
# Delete and reinstall dependencies
rmdir /s node_modules
npm install
```

### Issue: Database connection error

**Solution**:
- Check internet connection
- Verify DATABASE_URL is correct from Neon dashboard
- Ensure Neon project is active (check Neon console)
- Test connection: `npx prisma db push`

---

## 📞 Getting Help

If something doesn't work:

1. **Check error message** carefully - it usually tells you what's wrong
2. **Google the error message** - most issues have Stack Overflow solutions
3. **Check the `.env` file** - 90% of issues are missing/wrong API keys
4. **Restart the dev server** - `npm run dev`
5. **Clear cache** - Delete `.next` folder and restart

---

## 🎉 Success!

If you see the home page at http://localhost:3000, you're done! 🚀

Your friend can now:
- Create an account
- Build a resume
- Generate cover letters
- Prepare for interviews
- Take skill assessments

---

## 📝 Common Commands Cheat Sheet

```bash
# Start development server
npm run dev

# Install dependencies
npm install

# Update database schema
npx prisma migrate deploy

# View database in browser
npx prisma studio

# Build for production
npm run build

# Run production build locally
npm start

# Stop the server
Ctrl + C (in terminal)

# Kill all Node.js processes
taskkill /F /IM node.exe
```

---

## 🔗 Useful Links

- **Node.js**: https://nodejs.org/
- **Git**: https://git-scm.com/
- **Neon PostgreSQL**: https://neon.tech/
- **Google gemini API**: https://aistudio.google.com/
- **Clerk Authentication**: https://clerk.com/
- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs/

---

## ✅ You're All Set!

Share this guide with your friend and they'll have the project running in no time! 🚀

Happy coding! 💻
