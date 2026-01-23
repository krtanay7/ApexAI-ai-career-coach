import { getSkillRoadmap } from "@/actions/skill-roadmap";
import SkillRoadmapView from "./_components/skill-roadmap-view";

export default async function SkillRoadmapPage() {
  const roadmap = await getSkillRoadmap();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-6xl font-bold gradient-title">
          Skill Improvement Roadmap
        </h1>
      </div>
      <SkillRoadmapView roadmap={roadmap} />
    </div>
  );
}
