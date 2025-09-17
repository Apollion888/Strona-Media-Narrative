import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '../utils/blog';
import AnimatedElement from '../components/AnimatedElement';

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  // If post not found, show 404-like message
  if (!post) {
    return (
      <div className="blog-post-page">
        <div className="container">
          <AnimatedElement animationType="fadeInUp" delay={100}>
            <div className="blog-post-not-found">
              <h1>Post nie został znaleziony</h1>
              <p>Szukany wpis nie istnieje lub został przeniesiony.</p>
              <Link to="/blog" className="btn btn-primary">
                ← Wróć do bloga
              </Link>
            </div>
          </AnimatedElement>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="blog-post-page">
      <div className="container">
        <AnimatedElement animationType="fadeInUp" delay={100}>
          <article className="blog-post">
            {/* Post header */}
            <header className="blog-post-header">
              <div className="blog-post-meta">
                <Link to="/blog" className="blog-breadcrumb">
                  ← Blog
                </Link>
                <time dateTime={post.date.toISOString()} className="blog-post-date">
                  {formatDate(post.date)}
                </time>
              </div>
              
              <h1 className="blog-post-title">{post.title}</h1>
              
              {post.description && (
                <p className="blog-post-description">{post.description}</p>
              )}
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="blog-post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="blog-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Cover image */}
            {post.cover && (
              <div className="blog-post-cover">
                <img
                  src={post.cover}
                  alt={post.title}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Post content */}
            <div className="blog-post-content">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom components for better styling
                  h1: ({ children }) => <h2 className="content-h1">{children}</h2>,
                  h2: ({ children }) => <h3 className="content-h2">{children}</h3>,
                  h3: ({ children }) => <h4 className="content-h3">{children}</h4>,
                  h4: ({ children }) => <h5 className="content-h4">{children}</h5>,
                  h5: ({ children }) => <h6 className="content-h5">{children}</h6>,
                  h6: ({ children }) => <h6 className="content-h6">{children}</h6>,
                  p: ({ children }) => <p className="content-p">{children}</p>,
                  ul: ({ children }) => <ul className="content-ul">{children}</ul>,
                  ol: ({ children }) => <ol className="content-ol">{children}</ol>,
                  li: ({ children }) => <li className="content-li">{children}</li>,
                  blockquote: ({ children }) => <blockquote className="content-blockquote">{children}</blockquote>,
                  code: ({ inline, children, ...props }) => {
                    return inline ? (
                      <code className="content-code-inline" {...props}>{children}</code>
                    ) : (
                      <code className="content-code-block" {...props}>{children}</code>
                    );
                  },
                  pre: ({ children }) => <pre className="content-pre">{children}</pre>,
                  a: ({ href, children }) => (
                    <a href={href} className="content-link" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                  img: ({ src, alt }) => (
                    <img 
                      src={src} 
                      alt={alt} 
                      className="content-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Post footer */}
            <footer className="blog-post-footer">
              <div className="blog-post-actions">
                <Link to="/blog" className="btn btn-outline">
                  ← Więcej wpisów
                </Link>
              </div>
            </footer>
          </article>
        </AnimatedElement>
      </div>
    </div>
  );
};

export default BlogPostPage;
