import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../data/mock';

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

    // Fade in
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
    }, 200);
  };

  return (
    <div className="threshold">
      <div
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.6s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Invitation Card - Sole clickable element */}
        <div 
          className="invitation-card-entry"
          onClick={handleEnter}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
          aria-label="Open the invitation"
        >
          <img
            src="https://customer-assets.emergentagent.com/job_select-hills/artifacts/nglee2mg_file_00000000b4bc7209a16dfa79341267fb.png"
            alt="HILLIA invitation"
            className="invitation-card-image"
          />
        </div>
        
        {/* Orientation microcopy - NOT clickable */}
        <div className="invitation-microcopy">
          Open the invitation
        </div>
      </div>
    </div>
  );
};

export default HomePage;
