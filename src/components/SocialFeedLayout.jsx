import React, { useState } from 'react';
import AnimatedElement from './AnimatedElement';

const SocialFeedLayout = ({ posts = [] }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Enhanced sample posts for social feed
  const samplePosts = [
    {
      id: 1,
      type: 'article',
      title: "AI Revolution in Creative Media",
      content: "Jak sztuczna inteligencja fundamentalnie zmienia sposób tworzenia treści wizualnych, od fotografii po wideo. Nowe algorytmy uczenia maszynowego otwierają niespotykane możliwości...",
      author: {
        name: "Media Narrative",
        avatar: "🤖",
        handle: "@media_narrative"
      },
      timestamp: "2024-09-10T14:30:00Z",
      category: "AI & Tech",
      engagement: {
        likes: 89,
        comments: 23,
        shares: 15,
        views: 1247
      },
      tags: ["#AI", "#Photography", "#Innovation"],
      featured: true,
      media: {
        type: "image",
        preview: "🎨 AI-generated artwork showcase"
      }
    },
    {
      id: 2,
      type: 'tutorial',
      title: "Neural Networks w Post-produkcji",
      content: "Praktyczne zastosowanie sieci neuronowych w profesjonalnej obróbce zdjęć i montażu wideo. Step-by-step tutorial z przykładami kodu...",
      author: {
        name: "Media Narrative",
        avatar: "🧠",
        handle: "@media_narrative"
      },
      timestamp: "2024-09-08T09:15:00Z",
      category: "Tutorial",
      engagement: {
        likes: 67,
        comments: 34,
        shares: 28,
        views: 892
      },
      tags: ["#NeuralNetworks", "#PostProduction", "#Tutorial"],
      featured: false,
      media: {
        type: "video",
        preview: "🎬 Tutorial video - 12 min"
      }
    },
    {
      id: 3,
      type: 'research',
      title: "Quantum Computing dla Kreatywnych",
      content: "Eksploracja potencjału obliczeń kwantowych w przyszłości branży kreatywnej i medialnej. Czy quantum computing zmieni sposób renderowania?",
      author: {
        name: "Media Narrative",
        avatar: "⚛️",
        handle: "@media_narrative"
      },
      timestamp: "2024-09-05T16:45:00Z",
      category: "Future Tech",
      engagement: {
        likes: 134,
        comments: 45,
        shares: 67,
        views: 2156
      },
      tags: ["#Quantum", "#FutureTech", "#Research"],
      featured: true,
      media: {
        type: "infographic",
        preview: "📊 Quantum computing infographic"
      }
    },
    {
      id: 4,
      type: 'announcement',
      title: "Coming Soon: Holographic Displays",
      content: "Przygotowuję serię artykułów o przyszłości wyświetlaczy holograficznych w reklamie i mediach. Pierwsza część już wkrótce!",
      author: {
        name: "Media Narrative",
        avatar: "🔮",
        handle: "@media_narrative"
      },
      timestamp: "2024-09-01T12:00:00Z",
      category: "Announcement",
      engagement: {
        likes: 45,
        comments: 12,
        shares: 8,
        views: 543
      },
      tags: ["#ComingSoon", "#Holography", "#Innovation"],
      featured: false,
      pinned: true
    }
  ];

  const blogPosts = posts.length > 0 ? posts : samplePosts;

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'przed chwilą';
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 48) return 'wczoraj';
    return postTime.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'article': return '📰';
      case 'tutorial': return '🎓'; 
      case 'research': return '🔬';
      case 'announcement': return '📢';
      default: return '📝';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'article': return '#00ff00';
      case 'tutorial': return '#00ffff';
      case 'research': return '#ff00ff';
      case 'announcement': return '#ffff00';
      default: return '#ffffff';
    }
  };

  const filteredPosts = activeFilter === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.type === activeFilter);

  const FeedPost = ({ post, index }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <AnimatedElement animationType="fadeInUp" delay={index * 100}>
        <div
          className="feed-post"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 47, 15, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%)',
            border: post.pinned ? '2px solid #ffff00' : post.featured ? '1px solid rgba(0, 255, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            marginBottom: '1.5rem',
            backdropFilter: 'blur(12px)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = post.featured ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = post.featured ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Pinned indicator */}
          {post.pinned && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                background: '#ffff00',
                color: '#000',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                zIndex: 2
              }}
            >
              📌 PINNED
            </div>
          )}

          {/* Post Header */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Avatar */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00ff00, #00ffff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    border: '2px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {post.author.avatar}
                </div>

                {/* Author info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '1rem' }}>
                      {post.author.name}
                    </span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                      {post.author.handle}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px' }}>
                    <span style={{ color: getTypeColor(post.type), fontSize: '0.8rem' }}>
                      {getTypeIcon(post.type)} {post.type.toUpperCase()}
                    </span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' }}>
                      • {formatTimeAgo(post.timestamp)}
                    </span>
                  </div>
                </div>
              </div>

              {/* More options */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>⋯</span>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div style={{ padding: '1.5rem' }}>
            {/* Title */}
            <h3
              style={{
                color: '#ffffff',
                fontSize: '1.4rem',
                fontWeight: '600',
                lineHeight: '1.3',
                marginBottom: '1rem',
                cursor: 'pointer'
              }}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {post.title}
            </h3>

            {/* Content */}
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '1rem',
                lineHeight: '1.6',
                marginBottom: '1rem',
                cursor: 'pointer'
              }}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? post.content : `${post.content.substring(0, 150)}...`}
              {!isExpanded && (
                <span style={{ color: '#00ff00', marginLeft: '0.5rem' }}>Pokaż więcej</span>
              )}
            </p>

            {/* Media preview */}
            {post.media && (
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }}>
                  {post.media.preview}
                </div>
              </div>
            )}

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {post.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  style={{
                    color: '#00ffff',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.style.color = '#00ffff'}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Engagement Bar */}
          <div
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', gap: '2rem' }}>
              {/* Like */}
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: isLiked ? '#ff4444' : 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease'
                }}
                onClick={() => setIsLiked(!isLiked)}
                onMouseEnter={(e) => e.target.style.color = '#ff4444'}
                onMouseLeave={(e) => e.target.style.color = isLiked ? '#ff4444' : 'rgba(255, 255, 255, 0.6)'}
              >
                {isLiked ? '❤️' : '🤍'} {post.engagement.likes + (isLiked ? 1 : 0)}
              </button>

              {/* Comment */}
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                💬 {post.engagement.comments}
              </button>

              {/* Share */}
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                🔄 {post.engagement.shares}
              </button>
            </div>

            {/* Views */}
            <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' }}>
              👁 {post.engagement.views} views
            </div>
          </div>
        </div>
      </AnimatedElement>
    );
  };

  return (
    <div className="social-feed-layout" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      {/* Filter Tabs */}
      <AnimatedElement animationType="fadeIn" delay={50}>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '1rem',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          {['all', 'article', 'tutorial', 'research', 'announcement'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                background: activeFilter === filter 
                  ? 'linear-gradient(135deg, #00ff00, #00ffff)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: activeFilter === filter ? '#000000' : '#ffffff',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== filter) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== filter) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              {filter === 'all' ? 'Wszystkie' : filter}
            </button>
          ))}
        </div>
      </AnimatedElement>

      {/* Feed Posts */}
      <div className="feed-posts">
        {filteredPosts.map((post, index) => (
          <FeedPost key={post.id} post={post} index={index} />
        ))}
      </div>

      {/* Load More */}
      <AnimatedElement animationType="fadeInUp" delay={400}>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 0, 0.2), rgba(0, 255, 255, 0.2))',
              border: '1px solid rgba(0, 255, 0, 0.5)',
              color: '#ffffff',
              padding: '1rem 2rem',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(0, 255, 0, 0.3), rgba(0, 255, 255, 0.3))';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, rgba(0, 255, 0, 0.2), rgba(0, 255, 255, 0.2))';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ⬇ Załaduj więcej postów
          </button>
        </div>
      </AnimatedElement>
    </div>
  );
};

export default SocialFeedLayout;
