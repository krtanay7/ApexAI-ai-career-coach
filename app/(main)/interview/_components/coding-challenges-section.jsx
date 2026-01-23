"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Code2,
  CheckCircle2,
  Target,
  Zap,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CodingChallengeCard from "./coding-challenge-card";

export default function CodingChallengesSection({ challenges, stats }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [expandedChallenge, setExpandedChallenge] = useState(null);

  // Ensure stats has necessary properties with defaults
  const statsData = {
    total: stats?.total || 0,
    solved: stats?.solved || 0,
    attempted: stats?.attempted || 0,
    byDifficulty: stats?.byDifficulty || { easy: 0, medium: 0, hard: 0 },
    byLanguage: stats?.byLanguage || {},
  };

  // Filter challenges
  const challengeList = Array.isArray(challenges) ? challenges : [];
  const filtered = challengeList.filter(c => {
    const diffMatch = !selectedDifficulty || c.difficulty === selectedDifficulty;
    const langMatch = !selectedLanguage || c.language === selectedLanguage;
    return diffMatch && langMatch;
  });

  const solveRate = statsData.total > 0 ? Math.round((statsData.solved / statsData.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-6 border">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Problems Solved
            </h3>
            <div className="text-3xl font-bold text-blue-600">{statsData.solved}</div>
            <p className="text-xs text-muted-foreground">of {statsData.total} total</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Success Rate
            </h3>
            <div className="text-3xl font-bold text-green-600">{solveRate}%</div>
            <Progress value={solveRate} className="mt-2" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Easy
            </h3>
            <div className="text-3xl font-bold text-green-500">{statsData.byDifficulty.easy}</div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Medium
            </h3>
            <div className="text-3xl font-bold text-yellow-500">{statsData.byDifficulty.medium}</div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Hard
            </h3>
            <div className="text-3xl font-bold text-red-500">{statsData.byDifficulty.hard}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium flex items-center gap-1">
          <Filter className="h-4 w-4" />
          Filter:
        </span>
        <Button
          variant={selectedDifficulty === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDifficulty(null)}
        >
          All Difficulties
        </Button>
        <Button
          variant={selectedDifficulty === "Easy" ? "default" : "outline"}
          size="sm"
          className={selectedDifficulty === "Easy" ? "bg-green-500" : ""}
          onClick={() => setSelectedDifficulty("Easy")}
        >
          Easy
        </Button>
        <Button
          variant={selectedDifficulty === "Medium" ? "default" : "outline"}
          size="sm"
          className={selectedDifficulty === "Medium" ? "bg-yellow-500" : ""}
          onClick={() => setSelectedDifficulty("Medium")}
        >
          Medium
        </Button>
        <Button
          variant={selectedDifficulty === "Hard" ? "default" : "outline"}
          size="sm"
          className={selectedDifficulty === "Hard" ? "bg-red-500" : ""}
          onClick={() => setSelectedDifficulty("Hard")}
        >
          Hard
        </Button>
      </div>

      {/* Language Filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium">Languages:</span>
        <Button
          variant={selectedLanguage === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedLanguage(null)}
        >
          All Languages
        </Button>
        {Object.keys(statsData.byLanguage || {}).map(lang => (
          <Button
            key={lang}
            variant={selectedLanguage === lang ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLanguage(lang)}
          >
            {lang}
          </Button>
        ))}
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Code2 className="h-5 w-5" />
          Coding Challenges ({filtered.length})
        </h3>

        {filtered.length > 0 ? (
          filtered.map((challenge, idx) => (
            <CodingChallengeCard
              key={challenge.id || `challenge-${idx}`}
              challenge={challenge}
              onSolved={() => {
                // Refresh stats when a challenge is solved
                window.location.reload();
              }}
            />
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                No challenges found with current filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Practice Tips */}
      <Card className="bg-purple-50 dark:bg-purple-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Tips for Success
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Start with Easy:</strong> Build confidence and understand patterns</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Use Hints:</strong> Don't get stuck, hints are provided for a reason</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Understand the Solution:</strong> After solving, understand the approach</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Practice Regularly:</strong> 30 mins daily is better than occasional marathons</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Different Languages:</strong> Practice in your target interview language</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
