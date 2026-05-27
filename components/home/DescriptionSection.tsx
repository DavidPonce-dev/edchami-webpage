interface DescriptionSectionProps {
  title: string;
  paragraphs: string[];
}

export function DescriptionSection({ title, paragraphs }: DescriptionSectionProps) {
  return (
    <section className="p-5 md:p-10 min-h-96">
      <h2 className="text-2xl mb-10 font-bold text-center md:text-left">{title}</h2>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="my-5 text-sm">{paragraph}</p>
      ))}
    </section>
  );
}
