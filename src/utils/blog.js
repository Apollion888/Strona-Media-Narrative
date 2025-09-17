import matter from 'gray-matter';

// Import all markdown files from content/blog directory
const blogPosts = import.meta.glob('/content/blog/**/*.md', { as: 'raw', eager: true });

/**
 * Parse a single blog post from raw markdown content
 * @param {string} filePath - The file path
 * @param {string} raw - Raw markdown content
 * @returns {Object} Parsed blog post with metadata and content
 */
function parseBlogPost(filePath, raw) {
  const { data: frontmatter, content } = matter(raw);

  // Extract slug from filename (remove path and extension)
  const filename = filePath.split('/').pop();
  const slug = filename.replace(/\.md$/, '');

  return {
    slug,
    title: frontmatter.title || 'Untitled',
    date: frontmatter.date ? new Date(frontmatter.date) : new Date(),
    description: frontmatter.description || '',
    cover: frontmatter.cover || null,
    tags: frontmatter.tags || [],
    featured: frontmatter.featured || false,
    excerpt: frontmatter.excerpt || content.slice(0, 160).replace(/[#*`]/g, '').trim(),
    content,
    frontmatter,
  };
}

/**
 * Get all blog posts sorted by date (newest first)
 * @returns {Array} Array of parsed blog posts
 */
export function getAllPosts() {
  const posts = Object.entries(blogPosts).map(([filePath, raw]) => {
    return parseBlogPost(filePath, raw);
  });

  // Sort by date, newest first
  return posts.sort((a, b) => b.date - a.date);
}

/**
 * Get a single blog post by slug
 * @param {string} slug - The post slug
 * @returns {Object|null} The blog post or null if not found
 */
export function getPostBySlug(slug) {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

/**
 * Get featured blog posts
 * @returns {Array} Array of featured blog posts
 */
export function getFeaturedPosts() {
  return getAllPosts().filter((post) => post.featured);
}

/**
 * Get blog posts by tag
 * @param {string} tag - The tag to filter by
 * @returns {Array} Array of blog posts with the specified tag
 */
export function getPostsByTag(tag) {
  return getAllPosts().filter((post) =>
    post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase()),
  );
}
