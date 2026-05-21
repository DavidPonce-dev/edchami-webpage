import { Skill } from "@/data/skills";
import SkillItem from "./SkillItem";

interface SkillCategoryProps {
  title: string;
  skills: Skill[];
}

export default function SkillCategory({ title, skills }: SkillCategoryProps) {
  return (
    <div className="mb-6">
      <h1 className="text-lg font-bold underline text-center md:text-left mb-3">
        {title}
      </h1>
      <div className="flex flex-wrap justify-evenly text-center">
        {skills.map((skill) => (
          <SkillItem key={skill.name} skill={skill} />
        ))}
      </div>
    </div>
  );
}
