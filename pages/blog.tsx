import React from 'react';
import Layout from '../components/Layout';

const BlogPost = ({ title, date, excerpt }: { title: string; date: string; excerpt: string }) => (
  <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{title}</h2>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{date}</p>
    <p className="text-gray-700 dark:text-gray-300">{excerpt}</p>
    <a href="#" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">Read more</a>
  </div>
);

const BlogPage: React.FC = () => {
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
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Our Blog</h1>
        <div className="grid gap-8">
          {blogPosts.map((post, index) => (
            <BlogPost key={index} {...post} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;
