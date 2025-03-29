'use client';

import React from 'react';
import Link from 'next/link';

const BlogPost = ({ title, date, excerpt }: { title: string; date: string; excerpt: string }) => (
  <div className="mb-8 p-4 bg-background dark:bg-background-dark rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{date}</p>
    <p className="text-foreground dark:text-text-light text-sm">{excerpt}</p>
    <a href="#" className="mt-3 inline-block text-primary dark:text-secondary hover:underline">Read more</a>
  </div>
);

export default function BlogPage() {
  const blogPosts = [
    {
      title: "Empowering Democracy Through Technology",
      date: "June 1, 2023",
      excerpt: "Explore how AI-enabled tools are revolutionizing communication between representatives and constituents."
    },
    {
      title: "The Future of Constituent Engagement",
      date: "May 15, 2023",
      excerpt: "Discover new strategies for effective, opinionated, and goal-oriented communications in modern democracy."
    },
    {
      title: "Bridging the Gap: Representatives and Constituents",
      date: "May 1, 2023",
      excerpt: "Learn about innovative solutions addressing the growing disconnect between people and their elected officials."
    }
  ];

  return (
    // Removed redundant header - it's in layout.tsx
    <div className="min-h-screen bg-background dark:bg-background-dark text-foreground dark:text-text-light p-8">
      
      <main>
        <h1 className="text-3xl font-bold mb-6">Our Blog</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <BlogPost key={index} {...post} />
          ))}
        </div>
      </main>
      
      {/* Removed redundant footer - it will be added to layout.tsx */}
    </div>
  );
}