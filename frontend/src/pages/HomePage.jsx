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
        {/* Hero Image - Invitation Card */}
        <div className="hero-image-container ambient-motion">
          <img
            src="https://customer-assets.emergentagent.com/job_select-hills/artifacts/nglee2mg_file_00000000b4bc7209a16dfa79341267fb.png"
            alt="HILLIA invitation"
            className="hero-image"
            style={{
              objectFit: 'contain',
              height: '400px',
              width: 'auto',
              maxWidth: '100%',
            }}
          />
        </div>
        
        {/* Entry point */}
        <div 
          className="invitation-entry"
          onClick={handleEnter}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
        >
          by invitation
        </div>

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
