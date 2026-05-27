import { frontendSkills, backendSkills, toolsSkills, type Skill } from "@/data/skills";

interface SkillsSectionProps {
  title: string;
}

function SkillList({ skills }: { skills: Skill[] }) {
  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {skills.map((skill) => (
        <div key={skill.name} className="flex flex-col items-center gap-2 w-20">
          <img src={skill.image} alt={skill.name} className="h-12 w-12 object-contain" />
          <p className="text-xs text-center text-muted-foreground">{skill.name}</p>
        </div>
      ))}
    </div>
  );
}

export function SkillsSection({ title }: SkillsSectionProps) {
  return (
    <section className="p-5 md:p-10 min-h-96">
      <h2 className="text-2xl mb-3 font-bold text-center md:text-left">{title}</h2>
      <div>
        <h2 className="text-lg font-semibold text-foreground">Frontend</h2>
        <SkillList skills={frontendSkills} />
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-foreground">Backend</h2>
        <SkillList skills={backendSkills} />
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-foreground">Herramientas</h2>
        <SkillList skills={toolsSkills} />
      </div>
    </section>
  );
}
