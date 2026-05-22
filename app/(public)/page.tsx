import HeroSection from "@/components/home/HeroSection";
import DescriptionSection from "@/components/home/DescriptionSection";
import SkillsSection from "@/components/home/SkillsSection";

export default function Home() {
  return (
    <>
      <HeroSection
        name="Hola mi amorcito <3"
        titles={["Desarrollador Full Stack", "Desarrollador IoT"]}
        interests={["Hardware", "Robótica"]}
        imageUrl="https://i.ytimg.com/vi/q5tjvJz87rw/maxresdefault.jpg"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <DescriptionSection
          title="Sobre Mí"
          paragraphs={[
            "Desarrollador Full Stack con experiencia en la creación de aplicaciones web escalables y soluciones IoT.",
            "Trabajo con tecnologías modernas de frontend y backend, priorizando la arquitectura limpia y las buenas prácticas de desarrollo.",
            "En constante aprendizaje y exploración de nuevas tecnologías para resolver problemas del mundo real.",
          ]}
        />
        <SkillsSection title="Habilidades" />
      </div>
    </>
  );
}
