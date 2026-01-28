import React, { useEffect, useState } from 'react';
import { approachContent } from '../data/mock';
import FooterNav from '../components/layout/FooterNav';

const ApproachPage = () => {
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
          <h1 className="page-title">{approachContent.title}</h1>
          <p className="page-intro">{approachContent.intro}</p>
        </header>

        <div className="editorial-content">
          {approachContent.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
      <FooterNav />
    </div>
  );
};

export default ApproachPage;
