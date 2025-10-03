const features = [
  {
    icon: "??",
    title: "Email-focused communication",
    description:
      "Leverage AI-assisted drafting tools to analyze constituent messages and suggest on-voice responses in seconds.",
  },
  {
    icon: "??",
    title: "Scalable conversations",
    description:
      "Run structured outreach to thousands of constituents without losing the personal tone that builds trust.",
  },
  {
    icon: "??",
    title: "Democracy, strengthened",
    description:
      "Give representatives and their teams clear, empathetic feedback loops so every voice can be heard.",
  },
] as const;

export default function FeaturesSection() {
  return (
    <section className="bg-background-light py-12 text-text-dark dark:bg-background-dark dark:text-text-light sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-primary dark:text-text-light sm:mb-12 sm:text-3xl md:text-4xl">
          Product Highlights
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {features.map(({ icon, title, description }) => (
            <article
              key={title}
              className="rounded-lg bg-white p-6 text-center shadow-md transition duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg dark:bg-gray-800"
            >
              <div className="mb-4 text-4xl" aria-hidden>
                {icon}
              </div>
              <h3 className="mb-3 text-xl font-semibold text-primary dark:text-text-light">{title}</h3>
              <p className="text-sm text-text-dark dark:text-text-light">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
