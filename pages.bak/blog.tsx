import React from 'react';

const BlogPost = ({ title, date, excerpt }: { title: string; date: string; excerpt: string }) => (
  <div className="mb-8 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-lg">
    <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800 dark:text-white">{title}</h2>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{date}</p>
    <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{excerpt}</p>
    <a href="#" className="mt-3 inline-block text-blue-600 dark:text-blue-400 hover:underline text-sm sm:text-base">Read more</a>
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white">Our Blog</h1>
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, index) => (
          <BlogPost key={index} {...post} />
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
