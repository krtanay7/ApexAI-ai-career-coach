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
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  BookOpen,
  Target,
  Clock,
  Award,
  ArrowRight,
  ExternalLink,
  Zap,
} from "lucide-react";
import { updateRoadmapProgress } from "@/actions/skill-roadmap";
import { toast } from "sonner";

export default function SkillRoadmapView({ roadmap }) {
  const [expandedPhase, setExpandedPhase] = useState(0);
  const [completedSkills, setCompletedSkills] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSkillCompletion = async (skill) => {
    setIsUpdating(true);
    try {
      const newCompleted = completedSkills.includes(skill)
        ? completedSkills.filter(s => s !== skill)
        : [...completedSkills, skill];
      
      setCompletedSkills(newCompleted);
      
      await updateRoadmapProgress(newCompleted);
      toast.success("Progress updated!");
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress");
    } finally {
      setIsUpdating(false);
    }
  };

  const phases = roadmap.phases || [];
  const currentSkills = roadmap.currentSkills || [];
  const targetSkills = roadmap.targetSkills || [];
  const skillsToLearn = targetSkills.filter(s => !currentSkills.includes(s));

  return (
    <div className="space-y-6 py-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-6 border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Overall Progress
            </h3>
            <div className="text-4xl font-bold text-blue-600">
              {roadmap.overallProgress}%
            </div>
            <Progress value={roadmap.overallProgress} className="mt-3" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Skills to Acquire
            </h3>
            <div className="text-4xl font-bold text-purple-600">
              {skillsToLearn.length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              of {targetSkills.length} total skills
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Estimated Duration
            </h3>
            <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <Clock className="h-6 w-6" />
              {roadmap.estimatedDuration}
            </div>
          </div>
        </div>
      </div>

      {/* Current Skills */}
      {currentSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Your Current Skills
            </CardTitle>
            <CardDescription>
              Skills you already possess and can leverage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentSkills.map((skill) => (
                <Badge key={skill} variant="default" className="bg-green-500">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills to Learn */}
      {skillsToLearn.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-500" />
              Skills to Learn
            </CardTitle>
            <CardDescription>
              Focus on acquiring these industry-demanded skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skillsToLearn.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="cursor-pointer hover:bg-orange-50"
                  onClick={() => handleSkillCompletion(skill)}
                >
                  {completedSkills.includes(skill) ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                      {skill}
                    </>
                  ) : (
                    <>{skill}</>
                  )}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Click on a skill to mark it as completed
            </p>
          </CardContent>
        </Card>
      )}

      {/* Roadmap Phases */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="h-6 w-6 text-yellow-500" />
          Your Learning Path
        </h2>

        {phases.length > 0 ? (
          phases.map((phase, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() =>
                setExpandedPhase(expandedPhase === index ? -1 : index)
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                        {phase.phase}
                      </div>
                      <div>
                        <CardTitle>{phase.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4" />
                          {phase.duration}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      expandedPhase === index ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </CardHeader>

              {expandedPhase === index && (
                <CardContent className="pt-0 space-y-6">
                  {/* Skills for this Phase */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      Skills to Develop
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {phase.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Resources */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-purple-500" />
                      Learning Resources
                    </h4>
                    <div className="space-y-3">
                      {phase.resources.map((resource, resIdx) => (
                        <div
                          key={resIdx}
                          className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {resource.type}
                                </Badge>
                                <span className="font-medium">
                                  {resource.title}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {resource.platform}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {resource.duration}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2"
                              asChild
                            >
                              <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestone */}
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-green-600" />
                      Phase Milestone
                    </h4>
                    <p className="text-sm text-green-900 dark:text-green-100">
                      {phase.milestone}
                    </p>
                  </div>

                  {/* Tips */}
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                      Pro Tips
                    </h4>
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      {phase.tips}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                Loading your personalized roadmap...
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Success Stories */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
        <CardHeader>
          <CardTitle>🎓 Success Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Build projects:</strong> Apply what you learn in real
                projects to solidify understanding
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Join communities:</strong> Connect with others learning
                the same skills
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Teach others:</strong> Reinforce your knowledge by
                helping others
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Consistency matters:</strong> Regular practice beats
                cramming
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
