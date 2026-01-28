import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { homepageContent, siteConfig, STORAGE_KEYS } from '../data/mock';

const HomePage = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already entered
    const entered = localStorage.getItem(STORAGE_KEYS.HAS_ENTERED);
    if (entered === 'true') {
      setHasEntered(true);
    }

    // Fade in animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Lock scroll on homepage until entered
    if (!hasEntered) {
      document.body.classList.add('threshold-locked');
    } else {
      document.body.classList.remove('threshold-locked');
    }

    return () => {
      document.body.classList.remove('threshold-locked');
    };
  }, [hasEntered]);

  const handleEnter = () => {
    localStorage.setItem(STORAGE_KEYS.HAS_ENTERED, 'true');
    setHasEntered(true);
    // Navigate to philosophy page after entry
    setTimeout(() => {
      navigate('/philosophy');
    }, 300);
  };

  return (
    <div className="threshold">
      <div
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Hero Image Container - Clickable */}
        <div 
          className="hero-image-container ambient-motion invitation-clickable"
          onClick={handleEnter}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
        >
          <img
            src="https://images.pexels.com/photos/7964976/pexels-photo-7964976.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Weathered wood surface"
            className="hero-image"
            style={{
              objectFit: 'cover',
              height: '360px',
            }}
          />
          {/* Invitation Card Overlay */}
          <div className="invitation-overlay">
            <div className="invitation-wordmark">{siteConfig.name}</div>
            <div className="invitation-subtitle">{siteConfig.tagline}</div>
          </div>
        </div>
        
        {/* Microcopy beneath card */}
        <div className="invitation-hint">Open the invitation</div>

        {/* Entry Text */}
        <div className="entry-text">
          {homepageContent.entryText.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
