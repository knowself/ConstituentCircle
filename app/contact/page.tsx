"use client";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background p-8 text-foreground dark:bg-background-dark dark:text-text-light">
      <main>
        <h1 className="mb-6 text-3xl font-bold">Our History</h1>

        <div className="mb-8 space-y-6 text-sm leading-6">
          <p>
            Founded in 2024, Constituent Circle is the latest step in America&rsquo;s tradition of civic innovation. When people consider the impact of AI, the focus is usually on business, manufacturing, medicine, or law, but the health of our democratic institutions may be the most important application for this transformative technology. We are proud to define and lead a category that can improve lives around the world.
          </p>

          <p>
            Our journey is guided by a commitment to excellence, integrity, and the belief that the will of the people&mdash;properly amplified&mdash;should sit at the center of public life.
          </p>

          <p>
            The Founding Fathers viewed the quest for &ldquo;a more perfect union&rdquo; as a dynamic process: one that requires compromise, adaptation, and dedication to liberty and justice. Through the Constitution, their speeches, and writings such as the Federalist Papers, they laid the groundwork for a nation capable of evolving, leaving each generation to continue the work.
          </p>
        </div>

        <section className="mt-12">
          <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-background-light p-6 text-center shadow-md dark:border-gray-700 dark:bg-background-dark">
            <div className="mb-4 text-primary dark:text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground dark:text-text-light">Email</h2>
            <a href="mailto:contact@constituentcircle.com" className="mb-1 text-lg text-primary hover:underline dark:text-secondary">
              contact@constituentcircle.com
            </a>
          </div>
        </section>
      </main>

      <footer className="mt-8 border-t border-gray-200 pt-4 text-center text-gray-600 dark:border-gray-700 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Constituent Circle, LLC. All rights reserved.
      </footer>
    </div>
  );
}
