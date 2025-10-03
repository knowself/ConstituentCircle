import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="mt-4 bg-background-light pb-12 text-text-dark dark:bg-background-dark dark:text-text-light sm:pb-16 md:pb-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Empowering Representative Democracy with AI
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed sm:text-xl md:text-2xl">
          AI-enabled tools for effective, opinionated, goal-oriented communications between representatives and constituents.
        </p>
        <Link
          href="/services"
          className="mb-16 inline-block rounded-lg bg-secondary px-6 py-3 text-lg font-bold text-text-light shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-opacity-90 sm:text-xl"
        >
          Learn More
        </Link>

        <div className="mt-16 border-t border-gray-200 pt-8 dark:border-gray-700">
          <h2 className="mb-6 text-2xl font-bold sm:text-3xl md:text-4xl">About Constituent Circle</h2>
          <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed sm:text-xl">
            Constituent Circle is an AI technology platform designed to enhance communication between representatives and their constituents. By leveraging artificial intelligence and natural language processing, we enable representatives to craft personalized, on-message communications efficiently while maintaining their authentic voice.
          </p>
          <blockquote className="mx-auto mb-8 max-w-3xl rounded-r-lg border-l-4 border-secondary bg-gray-100 py-2 pl-4 text-left italic text-text-dark dark:bg-gray-800 dark:text-text-light sm:py-4 sm:pl-6">
            <p className="mb-2 text-lg">
              &ldquo;Many forms of Government have been tried, and will be tried in this world of sin and woe. No one pretends that democracy is perfect or all-wise. Indeed it has been said that democracy is the worst form of Government except for all those other forms that have been tried from time to time.&rdquo;
            </p>
            <footer className="mt-2 text-right font-semibold text-primary dark:text-secondary">Winston Churchill, 1947</footer>
          </blockquote>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed sm:text-xl">
            Our goal is to facilitate meaningful, goal-oriented conversations at scale, ensuring that constituents feel heard and represented, regardless of the communication channel. We believe in the power of representative democracy and are committed to addressing the growing disconnect between people and their elected officials.
          </p>
        </div>
      </div>
    </section>
  );
}
