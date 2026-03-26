import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const destinations = [
  { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80', tag: 'Romantic' },
  { name: 'Kyoto', country: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80', tag: 'Cultural' },
  { name: 'Maldives', country: 'Maldives', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', tag: 'Beach' },
  { name: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80', tag: 'City' },
  { name: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', tag: 'Nature' },
  { name: 'New York', country: 'USA', img: 'https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?w=600&q=80', tag: 'City' },
];

const stats = [
  { value: '10K+', label: 'Happy Travelers' },
  { value: '150+', label: 'Destinations' },
  { value: '500+', label: 'Trips Planned' },
  { value: '4.9★', label: 'Average Rating' },
];

const Home = () => {
  const { user } = useAuth();
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=80" alt="travel" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <span className="hero-tag animate-fadeInUp">✦ Premium Travel Planner</span>
          <h1 className="hero-title animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Plan Your<br /><span className="gold-text">Perfect Journey</span>
          </h1>
          <p className="hero-subtitle animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            Curate extraordinary travel experiences. Organize, explore, and create memories that last a lifetime.
          </p>
          <div className="hero-actions animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            {user ? (
              <Link to="/trips"><button className="btn-gold">My Trips →</button></Link>
            ) : (
              <>
                <Link to="/signup"><button className="btn-gold">Get Started Free</button></Link>
                <Link to="/login"><button className="btn-outline">Sign In</button></Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-indicator"></div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div className="stat-item reveal" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <h3 className="stat-value">{s.value}</h3>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section className="destinations-section page-wrapper">
        <div className="section-header reveal">
          <span className="section-tag">EXPLORE</span>
          <h2>Top Destinations</h2>
          <div className="gold-divider"></div>
          <p>Discover the world's most breathtaking places</p>
        </div>
        <div className="dest-grid">
          {destinations.map((d, i) => (
            <div className="dest-card reveal" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="dest-img-wrap">
                <img src={d.img} alt={d.name} loading="lazy" />
                <span className="dest-tag badge badge-gold">{d.tag}</span>
              </div>
              <div className="dest-info">
                <h3>{d.name}</h3>
                <p>{d.country}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section page-wrapper">
        <div className="section-header reveal">
          <span className="section-tag">FEATURES</span>
          <h2>Why Choose Voyager?</h2>
          <div className="gold-divider"></div>
        </div>
        <div className="features-grid">
          {[
            { icon: '🗺️', title: 'Smart Trip Planning', desc: 'Create detailed itineraries with dates, budgets, and activities all in one place.' },
            { icon: '📸', title: 'Visual Journey', desc: 'Add photos and memories to document every incredible moment of your trip.' },
            { icon: '💰', title: 'Budget Tracking', desc: 'Keep track of your travel expenses and stay within your budget effortlessly.' },
            { icon: '🔒', title: 'Secure & Private', desc: 'Your travel plans are encrypted and accessible only to you, anytime anywhere.' },
          ].map((f, i) => (
            <div className="card feature-card reveal" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <div className="gold-divider"></div>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="cta-section">
          <div className="cta-content reveal">
            <h2>Ready to Explore the World?</h2>
            <p>Join thousands of travelers who plan their dream trips with Voyager.</p>
            <Link to="/signup"><button className="btn-gold">Start Planning Now</button></Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <p className="nav-logo" style={{ fontSize: '1.2rem' }}>✈ VOYAGER</p>
        <p style={{ color: 'var(--gray)', fontSize: '0.8rem', marginTop: '10px' }}>
          © 2024 Voyager. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;