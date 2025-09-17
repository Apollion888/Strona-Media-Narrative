import React from 'react';
import AnimatedElement from './AnimatedElement';

const StaticInfoBoard = ({ posts = [] }) => {
  // Enhanced sample blog posts data
  const samplePosts = [
    {
      id: 1,
      title: 'AI w Fotografii: Rewolucja czy Ewolucja?',
      date: '2024-09-10',
      category: 'AI & Tech',
      preview:
        'Jak sztuczna inteligencja zmienia sposób, w jaki tworzymy i postrzegamy fotografię...',
      readTime: '5 min',
      status: 'published',
      featured: true,
      author: 'Media Narrative',
      views: 1247,
      engagement: 89,
    },
    {
      id: 2,
      title: 'Neural Networks w Post-produkcji',
      date: '2024-09-08',
      category: 'Tutorial',
      preview: 'Praktyczne zastosowanie sieci neuronowych w obróbce zdjęć i wideo...',
      readTime: '8 min',
      status: 'published',
      featured: false,
      author: 'Media Narrative',
      views: 892,
      engagement: 67,
    },
    {
      id: 3,
      title: 'Quantum Computing dla Kreatywnych',
      date: '2024-09-05',
      category: 'Future Tech',
      preview: 'Jak obliczenia kwantowe mogą wpłynąć na przyszłość branży kreatywnej...',
      readTime: '12 min',
      status: 'published',
      featured: true,
      author: 'Media Narrative',
      views: 2156,
      engagement: 134,
    },
    {
      id: 4,
      title: 'Holographic Displays - Media 3.0',
      date: '2024-09-01',
      category: 'Innovation',
      preview: 'Przyszłość wyświetlaczy holograficznych w mediach i reklamie...',
      readTime: '6 min',
      status: 'draft',
      featured: false,
      author: 'Media Narrative',
      views: 0,
      engagement: 0,
    },
  ];

  const blogPosts = posts.length > 0 ? posts : samplePosts;

  const getStatusInfo = (status) => {
    switch (status) {
      case 'published':
        return { color: '#00ff00', label: 'LIVE', icon: '●' };
      case 'draft':
        return { color: '#ffff00', label: 'DRAFT', icon: '◐' };
      case 'coming-soon':
        return { color: '#ff8800', label: 'SOON', icon: '○' };
      default:
        return { color: '#00ff00', label: 'LIVE', icon: '●' };
    }
  };

  const InfoCard = ({ post, index }) => {
    const statusInfo = getStatusInfo(post.status);

    return (
      <AnimatedElement animationType="fadeInUp" delay={200 + index * 100}>
        <div
          className="info-card"
          style={{
            background:
              'linear-gradient(135deg, rgba(15, 47, 15, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%)',
            border: '1px solid rgba(0, 255, 0, 0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1rem',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = 'rgba(0, 255, 0, 0.3)';
            e.target.style.boxShadow = '0 8px 24px rgba(0, 255, 0, 0.1)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'rgba(0, 255, 0, 0.1)';
            e.target.style.boxShadow = 'none';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          {/* Status bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(90deg, ${statusInfo.color} 0%, transparent 100%)`,
              opacity: 0.8,
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem',
            }}
          >
            <div style={{ flex: 1 }}>
              {/* Category and Status */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '0.5rem',
                }}
              >
                <span
                  style={{
                    color: '#00ff88',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  {post.category}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: statusInfo.color, fontSize: '0.8rem' }}>
                    {statusInfo.icon}
                  </span>
                  <span
                    style={{
                      color: statusInfo.color,
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      letterSpacing: '1px',
                    }}
                  >
                    {statusInfo.label}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3
                style={{
                  color: '#ffffff',
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  lineHeight: '1.3',
                  marginBottom: '0.8rem',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                {post.title}
              </h3>

              {/* Preview */}
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  marginBottom: '1rem',
                }}
              >
                {post.preview}
              </p>
            </div>

            {/* Featured badge */}
            {post.featured && (
              <div
                style={{
                  padding: '4px 10px',
                  background: 'rgba(0, 255, 255, 0.15)',
                  border: '1px solid #00ffff',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  color: '#00ffff',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 'bold',
                  marginLeft: '1rem',
                }}
              >
                ★ FEATURED
              </div>
            )}
          </div>

          {/* Meta info */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: '1rem',
              padding: '1rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 255, 0, 0.1)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#00ff00', fontSize: '1.1rem', fontWeight: 'bold' }}>
                {new Date(post.date).toLocaleDateString('pl-PL', {
                  day: '2-digit',
                  month: '2-digit',
                })}
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>DATA</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#00ff00', fontSize: '1.1rem', fontWeight: 'bold' }}>
                {post.readTime}
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>CZAS</div>
            </div>

            {post.status === 'published' && (
              <>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#00ff00', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    {post.views}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>VIEWS</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#00ff00', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    {post.engagement}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>LIKES</div>
                </div>
              </>
            )}
          </div>
        </div>
      </AnimatedElement>
    );
  };

  return (
    <div className="static-info-board" style={{ padding: '2rem 0' }}>
      {/* Header */}
      <AnimatedElement animationType="fadeIn" delay={100}>
        <div
          style={{
            textAlign: 'center',
            marginBottom: '3rem',
            padding: '2rem',
            background:
              'linear-gradient(135deg, rgba(0, 255, 0, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%)',
            borderRadius: '15px',
            border: '1px solid rgba(0, 255, 0, 0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              background: 'linear-gradient(135deg, #ffffff, #00ff00)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: '600',
              marginBottom: '1rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            📊 Knowledge Database
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.1rem',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6',
            }}
          >
            Centralny punkt dostępu do najnowszych artykułów, eksperymentów i odkryć w dziedzinie
            technologii medialnych
          </p>

          {/* Status indicators */}
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#00ff00' }}>●</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                Published
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#ffff00' }}>◐</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Draft</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#ff8800' }}>○</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </AnimatedElement>

      {/* Info Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {blogPosts.map((post, index) => (
          <InfoCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {/* Summary Stats */}
      <AnimatedElement animationType="fadeInUp" delay={600}>
        <div
          style={{
            marginTop: '3rem',
            padding: '2rem',
            background:
              'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(15, 47, 15, 0.4) 100%)',
            borderRadius: '15px',
            border: '1px solid rgba(0, 255, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
          }}
        >
          <h3
            style={{
              color: '#ffffff',
              fontSize: '1.4rem',
              marginBottom: '1.5rem',
              fontWeight: '600',
            }}
          >
            📈 Database Statistics
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '2rem',
            }}
          >
            <div>
              <div style={{ color: '#00ff00', fontSize: '2rem', fontWeight: 'bold' }}>
                {blogPosts.filter((p) => p.status === 'published').length}
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                PUBLISHED ARTICLES
              </div>
            </div>

            <div>
              <div style={{ color: '#ffff00', fontSize: '2rem', fontWeight: 'bold' }}>
                {blogPosts.filter((p) => p.status === 'draft').length}
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                DRAFTS IN PROGRESS
              </div>
            </div>

            <div>
              <div style={{ color: '#00ffff', fontSize: '2rem', fontWeight: 'bold' }}>
                {blogPosts.filter((p) => p.featured).length}
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                FEATURED CONTENT
              </div>
            </div>

            <div>
              <div style={{ color: '#ff8800', fontSize: '2rem', fontWeight: 'bold' }}>
                {blogPosts.reduce((sum, p) => sum + (p.views || 0), 0)}
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                TOTAL VIEWS
              </div>
            </div>
          </div>
        </div>
      </AnimatedElement>
    </div>
  );
};

export default StaticInfoBoard;
