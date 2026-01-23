import { getAssessments } from "@/actions/interview";
import { getChallengeProgress, getCodingChallenges } from "@/actions/coding-challenge";
import { getAllQuestions, getQuestionProgress } from "@/actions/interview-questions";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import MonthlyPerformance from "./_components/monthly-performance";
import QuizList from "./_components/quiz-list";
import JobInterviewPrep from "./_components/job-interview-prep";
import CodingChallengesSection from "./_components/coding-challenges-section";
import QuestionBankView from "./_components/question-bank-view";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();
  const { challenges } = await getCodingChallenges();
  const { stats } = await getChallengeProgress();
  const questions = await getAllQuestions({ limit: 100 });
  const { stats: questionStats } = await getQuestionProgress();

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>
      <div className="space-y-6">
        <JobInterviewPrep />
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <MonthlyPerformance assessments={assessments} />
        <CodingChallengesSection challenges={challenges} stats={stats} />
        <QuestionBankView initialQuestions={questions} stats={questionStats} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}
