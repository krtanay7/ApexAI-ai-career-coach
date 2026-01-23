-- CreateTable
CREATE TABLE "SkillRoadmap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentSkills" TEXT[],
    "targetSkills" TEXT[],
    "phases" JSONB[],
    "overallProgress" INTEGER NOT NULL DEFAULT 0,
    "estimatedDuration" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillRoadmap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SkillRoadmap_userId_key" ON "SkillRoadmap"("userId");

-- CreateIndex
CREATE INDEX "SkillRoadmap_userId_idx" ON "SkillRoadmap"("userId");

-- AddForeignKey
ALTER TABLE "SkillRoadmap" ADD CONSTRAINT "SkillRoadmap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
