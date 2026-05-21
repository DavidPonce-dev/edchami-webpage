import { Skill } from "@/data/skills";

interface SkillItemProps {
  skill: Skill;
}

export default function SkillItem({ skill }: SkillItemProps) {
  return (
    <div className="mx-3 my-2 flex flex-col items-center">
      <img
        src={skill.image}
        alt={skill.name}
        width={60}
        height={60}
        className="mx-auto"
      />
      <p className="text-xs mt-1">{skill.name}</p>
    </div>
  );
}
