import { frontendSkills, backendSkills, toolsSkills } from "@/data/skills";
import SkillCategory from "./SkillCategory";

interface SkillsSectionProps {
  title: string;
}

export default function SkillsSection({ title }: SkillsSectionProps) {
  return (
    <section className="p-5 md:p-10 min-h-96">
      <h1 className="text-2xl mb-3 font-bold text-center md:text-left">{title}</h1>
      <SkillCategory title="Frontend" skills={frontendSkills} />
      <SkillCategory title="Backend" skills={backendSkills} />
      <SkillCategory title="Herramientas" skills={toolsSkills} />
    </section>
  );
}
