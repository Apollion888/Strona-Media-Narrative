import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const featureList = [
  {
    title: 'Markdown ready',
    description: 'Pisz w markdown z podgladem na zywo i kontrola wersji.',
  },
  {
    title: 'Optymalizacja grafik',
    description: 'Automatyczna konwersja do WebP i AVIF oraz kompresja.',
  },
  {
    title: 'System tagow',
    description: 'Grupuj wpisy wedlug tematow, klientow lub kampanii.',
  },
  {
    title: 'SEO i meta',
    description: 'Metadane, og image i adresy URL ustawiane z poziomu CMS.',
  },
  {
    title: 'Responsywny preview',
    description: 'Podglad mobile i desktop bez wychodzenia z panelu.',
  },
  {
    title: 'Focus na wydajnosc',
    description: 'Lazy loading i cache zapewniaja szybkie ladowanie wpisow.',
  },
];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
  },
};

const cardVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.18, 0.6, 0.32, 1] },
  },
};

const BlogPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch('/content/blog/');
        if (response.ok) {
          setPosts([]);
        }
      } catch (error) {
        console.info('Brak wpisow do zaimportowania.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    const identity = window.netlifyIdentity;
    if (!identity) {
      setLoading(false);
      return () => undefined;
    }

    const handleInit = (user) => setIsAdmin(!!user);
    const handleLogin = () => setIsAdmin(true);
    const handleLogout = () => setIsAdmin(false);

    identity.on('init', handleInit);
    identity.on('login', handleLogin);
    identity.on('logout', handleLogout);
    identity.init();

    return () => {
      identity.off('init', handleInit);
      identity.off('login', handleLogin);
      identity.off('logout', handleLogout);
    };
  }, []);

  const openIdentity = () => {
    const identity = window.netlifyIdentity;
    if (identity) {
      identity.open();
    }
  };

  const logoutIdentity = () => {
    const identity = window.netlifyIdentity;
    if (identity) {
      identity.logout();
    }
  };

  const openCms = () => {
    window.location.href = '/admin/';
  };

  return (
    <motion.div
      className="blog-admin-page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="container blog-admin-shell">
        <motion.header className="blog-admin-header" variants={cardVariants}>
          <span className="section-eyebrow">Panel wewnetrzny</span>
          <h1>Blog Media Narrative</h1>
          <p>Zarzadzaj wpisami i aktualizuj tre�ci w rytmie Apple x neon.</p>
        </motion.header>

        <motion.section className="blog-admin-panel" variants={cardVariants}>
          <div className="admin-status">
            Status:{' '}
            {isAdmin ? 'zalogowany administrator' : 'tryb podgladu (zaloguj sie aby edytowac)'}
          </div>

          <div className="admin-actions">
            <button className="btn btn-primary" type="button" onClick={openCms}>
              Otworz Netlify CMS
            </button>
            {isAdmin ? (
              <button className="btn btn-outline" type="button" onClick={logoutIdentity}>
                Wyloguj
              </button>
            ) : (
              <button className="btn btn-outline" type="button" onClick={openIdentity}>
                Zaloguj
              </button>
            )}
          </div>

          <div className="admin-grid">
            <article className="admin-card">
              <h3>Jak opublikowac nowy wpis</h3>
              <ol>
                <li>Kliknij przycisk Netlify CMS i zaloguj sie.</li>
                <li>
                  Wybierz kolekcje <strong>Blog posts</strong>.
                </li>
                <li>
                  Uzyj opcji <strong>New blog post</strong> aby utworzyc szkic.
                </li>
                <li>Dodaj zdjecie okladkowe, tagi i tresc w markdown.</li>
                <li>Zapisz szkic lub opublikuj wpis jednym kliknieciem.</li>
              </ol>
            </article>

            <article className="admin-card">
              <h3>Struktura wpisu</h3>
              <ul>
                <li>Tytul - krotki i konkretny.</li>
                <li>Lead - maks 240 znakow, wersja do social preview.</li>
                <li>Body - markdown z naglowkami H2/H3 i blokami media.</li>
                <li>Meta - tagi kampanii, data publikacji, status.</li>
              </ul>
            </article>
          </div>

          <article className="admin-card">
            <h3>Ostatnie szkice</h3>
            {loading ? (
              <div className="loader-ring" aria-label="Trwa ladowanie" />
            ) : posts.length ? (
              <ul>
                {posts.map((post) => (
                  <li key={post.slug}>{post.title}</li>
                ))}
              </ul>
            ) : (
              <p>Brak szkicow - zaczynamy od czystej kartki.</p>
            )}
          </article>
        </motion.section>

        <motion.section
          className="features-grid"
          initial="initial"
          animate="animate"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {featureList.map((feature) => (
            <motion.article className="feature-card" key={feature.title} variants={cardVariants}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.article>
          ))}
        </motion.section>
      </div>
    </motion.div>
  );
};

export default BlogPage;
