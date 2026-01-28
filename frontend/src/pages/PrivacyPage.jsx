import React, { useEffect, useState } from 'react';
import { privacyContent } from '../data/mock';
import FooterNav from '../components/layout/FooterNav';

const PrivacyPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page">
      <div
        className="page-content"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          paddingBottom: '120px',
        }}
      >
        <header className="page-header">
          <h1 className="page-title">{privacyContent.title}</h1>
          <p className="page-intro">{privacyContent.intro}</p>
        </header>

        <div className="privacy-sections">
          {privacyContent.sections.map((section, index) => (
            <div key={index} className="community-block">
              <h2 className="community-block-title">{section.title}</h2>
              <p className="community-block-text">{section.text}</p>
            </div>
          ))}
        </div>
      </div>
      <FooterNav />
    </div>
  );
};

export default PrivacyPage;
