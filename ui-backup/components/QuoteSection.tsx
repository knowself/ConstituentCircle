'use client';

export default function QuoteSection() {
  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <blockquote className="text-2xl sm:text-3xl font-serif italic">
          "Many forms of Government have been tried, and will be tried in this
          world of sin and woe. No one pretends that democracy is perfect or
          all-wise. Indeed it has been said that democracy is the worst form
          of Government except for all those other forms that have been
          tried from time to time."
        </blockquote>
        <p className="mt-4 text-xl text-gray-400">
          — Winston Churchill, 1947
        </p>
        <p className="mt-8 text-lg text-gray-300">
          We're here to strengthen the best form of government humanity has created.
        </p>
      </div>
    </section>
  );
}
