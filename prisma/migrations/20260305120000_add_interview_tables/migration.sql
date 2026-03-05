-- CreateTable
CREATE TABLE "CodingChallenge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "starterCode" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "testCases" JSONB[],
    "submissions" INTEGER NOT NULL DEFAULT 0,
    "passed" INTEGER NOT NULL DEFAULT 0,
    "bestTime" INTEGER,
    "bestSpace" TEXT,
    "status" TEXT NOT NULL DEFAULT 'not-started',
    "userCode" TEXT,
    "hints" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodingChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewQuestion" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT,
    "company" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "tags" TEXT[],
    "frequency" INTEGER NOT NULL DEFAULT 0,
    "mostAskedBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not-attempted',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastAttempted" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteQuestion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CodingChallenge_userId_idx" ON "CodingChallenge"("userId");

-- CreateIndex
CREATE INDEX "CodingChallenge_difficulty_idx" ON "CodingChallenge"("difficulty");

-- CreateIndex
CREATE INDEX "CodingChallenge_language_idx" ON "CodingChallenge"("language");

-- CreateIndex
CREATE INDEX "InterviewQuestion_company_idx" ON "InterviewQuestion"("company");

-- CreateIndex
CREATE INDEX "InterviewQuestion_category_idx" ON "InterviewQuestion"("category");

-- CreateIndex
CREATE INDEX "InterviewQuestion_difficulty_idx" ON "InterviewQuestion"("difficulty");

-- CreateIndex
CREATE INDEX "InterviewQuestion_role_idx" ON "InterviewQuestion"("role");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionProgress_userId_questionId_key" ON "QuestionProgress"("userId", "questionId");

-- CreateIndex
CREATE INDEX "QuestionProgress_userId_idx" ON "QuestionProgress"("userId");

-- CreateIndex
CREATE INDEX "QuestionProgress_status_idx" ON "QuestionProgress"("status");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteQuestion_userId_questionId_key" ON "FavoriteQuestion"("userId", "questionId");

-- CreateIndex
CREATE INDEX "FavoriteQuestion_userId_idx" ON "FavoriteQuestion"("userId");

-- AddForeignKey
ALTER TABLE "CodingChallenge" ADD CONSTRAINT "CodingChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionProgress" ADD CONSTRAINT "QuestionProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionProgress" ADD CONSTRAINT "QuestionProgress_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "InterviewQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteQuestion" ADD CONSTRAINT "FavoriteQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteQuestion" ADD CONSTRAINT "FavoriteQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "InterviewQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
