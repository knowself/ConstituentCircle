"use client";

import Link from "next/link";

type BlogPostProps = {
  title: string;
  date: string;
  excerpt: string;
};

const BlogPost = ({ title, date, excerpt }: BlogPostProps) => (
  <article className="mb-8 rounded-lg border border-gray-200 bg-background p-4 shadow-md dark:border-gray-700 dark:bg-background-dark">
    <h2 className="text-xl font-bold mb-2 text-foreground dark:text-text-light">{title}</h2>
    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{date}</p>
    <p className="text-sm text-foreground dark:text-text-light">{excerpt}</p>
    <Link href="/blog" className="mt-3 inline-block text-primary underline-offset-4 hover:underline dark:text-secondary">
      Read more
    </Link>
  </article>
);

export default function BlogPage() {
  const blogPosts: BlogPostProps[] = [
    {
      title: "Empowering Democracy Through Technology",
      date: "June 1, 2023",
      excerpt: "Explore how AI-enabled tools are revolutionizing communication between representatives and constituents.",
    },
    {
      title: "The Future of Constituent Engagement",
      date: "May 15, 2023",
      excerpt: "Discover new strategies for effective, opinionated, and goal-oriented communications in modern democracy.",
    },
    {
      title: "Bridging the Gap: Representatives and Constituents",
      date: "May 1, 2023",
      excerpt: "Learn about innovative solutions addressing the growing disconnect between people and their elected officials.",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8 text-foreground dark:bg-background-dark dark:text-text-light">
      <main>
        <h1 className="mb-6 text-3xl font-bold">Our Blog</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <BlogPost key={post.title} {...post} />
          ))}
        </div>
      </main>
    </div>
  );
}
