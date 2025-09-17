import React from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../utils/blog';
import AnimatedElement from '../components/AnimatedElement';

const BlogPage = () => {
  const posts = getAllPosts();

  // Format date for display
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="blog-page">
      <div className="container">
        <AnimatedElement animationType="fadeInUp" delay={100}>
          <div className="section-intro">
            <span className="section-eyebrow">Blog</span>
            <h1 className="section-title">
              Insights z produkcji i post-produkcji
            </h1>
            <p className="section-description">
              Dzielę się technikami, narzędziami i przemyśleniami z realizacji projektów. 
              Od planowania sesji po finalne efekty wizualne.
            </p>
          </div>
        </AnimatedElement>

        {posts.length === 0 ? (
          <AnimatedElement animationType="fadeInUp" delay={200}>
            <div className="blog-empty">
              <p>Wkrótce pojawią się pierwsze wpisy...</p>
            </div>
          </AnimatedElement>
        ) : (
          <div className="blog-posts">
            {posts.map((post, index) => (
              <AnimatedElement
                key={post.slug}
                animationType="fadeInUp"
                delay={200 + index * 50}
              >
                <article className="blog-post-card">
                  {/* Featured badge */}
                  {post.featured && (
                    <span className="blog-featured-badge">
                      Wyróżniony
                    </span>
                  )}

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
                    <header className="blog-post-header">
                      <time 
                        dateTime={post.date.toISOString()} 
                        className="blog-post-date"
                      >
                        {formatDate(post.date)}
                      </time>
                      
                      <h2 className="blog-post-title">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>
                      
                      {post.description && (
                        <p className="blog-post-description">
                          {post.description}
                        </p>
                      )}
                      
                      {/* Excerpt fallback */}
                      {!post.description && post.excerpt && (
                        <p className="blog-post-excerpt">
                          {post.excerpt}
                        </p>
                      )}
                    </header>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="blog-post-tags">
                        {post.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className="blog-tag">
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="blog-tag-more">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Read more link */}
                    <footer className="blog-post-footer">
                      <Link 
                        to={`/blog/${post.slug}`} 
                        className="blog-read-more"
                        aria-label={`Czytaj więcej: ${post.title}`}
                      >
                        Czytaj więcej →
                      </Link>
                    </footer>
                  </div>
                </article>
              </AnimatedElement>
            ))}
          </div>
        )}

        {/* Featured posts section */}
        {posts.some(post => post.featured) && (
          <AnimatedElement animationType="fadeInUp" delay={400}>
            <section className="blog-featured">
              <h2>Wyróżnione wpisy</h2>
              <div className="blog-featured-grid">
                {posts
                  .filter(post => post.featured)
                  .slice(0, 3)
                  .map((post) => (
                    <div key={post.slug} className="blog-featured-card">
                      <h3>
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p>{post.excerpt}</p>
                      <time dateTime={post.date.toISOString()}>
                        {formatDate(post.date)}
                      </time>
                    </div>
                  ))}
              </div>
            </section>
          </AnimatedElement>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
