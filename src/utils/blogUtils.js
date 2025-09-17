// Blog content utilities for Media Narrative
// This would typically fetch from a build-time static generation
// For now, we'll create a basic structure that can be extended
export const getBlogPosts = async () => {
  // In a real implementation, this would fetch from the content directory
  // For now, return sample data
  return [
    {
      slug: 'welcome-to-media-narrative',
      title: 'Welcome to Media Narrative Blog',
      date: '2024-12-12',
      description: 'Discover cutting-edge web development techniques and cyberpunk aesthetics in our inaugural blog post.',
      cover: '/images/blog/sample-cover.jpg',
      tags: ['web-development', 'cyberpunk', 'react'],
      featured: true,
      excerpt: 'This is a sample blog post showcasing our new Netlify CMS powered blog system. Built with modern web technologies...'
    }
  ];
};

export const getBlogPost = async (slug) => {
  // In a real implementation, this would fetch the specific post
  const posts = await getBlogPosts();
  return posts.find(post => post.slug === slug);
};

export const getFeaturedPosts = async () => {
  const posts = await getBlogPosts();
  return posts.filter(post => post.featured);
};

export const getPostsByTag = async (tag) => {
  const posts = await getBlogPosts();
  return posts.filter(post => post.tags.includes(tag));
};

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Generate reading time estimate
export const getReadingTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(' ').length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
};
