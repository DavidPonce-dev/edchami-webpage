interface HeroSectionProps {
  name: string;
  titles: string[];
  interests: string[];
  imageUrl: string;
}

export default function HeroSection({ name, titles, interests, imageUrl }: HeroSectionProps) {
  return (
    <section className="min-h-96 rounded-md bg-primary text-primary-foreground/80 dark:bg-hero dark:text-hero-foreground">
      <div className="grid md:grid-cols-2">
        <div className="p-5 md:p-10">
          <div className="block md:hidden">
            <img
              src={imageUrl}
              alt={name}
              height={288}
              className="h-72 w-72 rounded-full mx-auto object-cover"
              fetchPriority="high"
              decoding="async"
              loading="eager"
            />
          </div>
          <div className="my-5 text-center text-opacity-80 md:text-left text-1xl md:text-2xl glitch">
            <h1 className="text-3xl md:text-5xl font-bold">{name}</h1>
            {titles.map((title) => (
              <p key={title}>{title}</p>
            ))}
            {interests.map((interest) => (
              <p key={interest}>{interest}</p>
            ))}
          </div>
        </div>
        <div className="hidden md:block p-10">
          <img
            src={imageUrl}
            alt={name}
            width={288}
            height={288}
            className="h-72 w-72 rounded-full object-cover"
            fetchPriority="high"
            decoding="async"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
