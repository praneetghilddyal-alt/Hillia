import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../data/mock';
import { trackEvent, EVENTS } from '../services/api';

const HomePage = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already entered
    const entered = localStorage.getItem(STORAGE_KEYS.HAS_ENTERED);
    if (entered === 'true') {
      setHasEntered(true);
    }

    // Check if user has interacted before
    const interacted = sessionStorage.getItem('hillia_interacted');
    if (interacted === 'true') {
      setHasInteracted(true);
    }

    // Track homepage view
    trackEvent(EVENTS.HOMEPAGE_ENTRY);

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

  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      sessionStorage.setItem('hillia_interacted', 'true');
    }
  };

  const handleEnter = () => {
    // Track invitation opened
    trackEvent(EVENTS.INVITATION_OPENED);
    
    localStorage.setItem(STORAGE_KEYS.HAS_ENTERED, 'true');
    setHasEntered(true);
    // Navigate to philosophy page after entry
    setTimeout(() => {
      navigate('/philosophy');
    }, 200);
  };

  // Show microcopy on hover OR on first tap (mobile), hide after interaction
  const showMicrocopy = !hasInteracted && isHovered;

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
          onMouseEnter={() => { setIsHovered(true); handleInteraction(); }}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleInteraction}
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
        
        {/* Orientation microcopy - appears on hover, very low contrast, disappears after interaction */}
        <div 
          className="invitation-microcopy-hover"
          style={{
            opacity: showMicrocopy ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          Open the invitation
        </div>
      </div>
    </div>
  );
};

export default HomePage;
