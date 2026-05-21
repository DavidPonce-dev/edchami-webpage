import HeroSection from "@/components/home/HeroSection";
import DescriptionSection from "@/components/home/DescriptionSection";
import SkillsSection from "@/components/home/SkillsSection";

export default function Home() {
  return (
    <>
      <HeroSection
        name="Eduardo Chami"
        titles={["Desarrollador Full Stack", "Desarrollador IoT"]}
        interests={["Hardware", "Robótica"]}
        imageUrl="https://i.ytimg.com/vi/q5tjvJz87rw/maxresdefault.jpg"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <DescriptionSection
          title="Sobre Mí"
          paragraphs={[
            "Desarrollador Full Stack apasionado por crear aplicaciones web escalables y soluciones IoT.",
            "Experiencia en tecnologías modernas de frontend y backend, con enfoque en arquitectura limpia y buenas prácticas.",
            "Siempre aprendiendo y explorando nuevas tecnologías para resolver problemas reales.",
          ]}
        />
        <SkillsSection title="Habilidades" />
      </div>
    </>
  );
}
