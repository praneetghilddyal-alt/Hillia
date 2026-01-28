import React, { useEffect, useState } from 'react';
import { communityContent } from '../data/mock';
import FooterNav from '../components/layout/FooterNav';

const CommunityPage = () => {
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
          <h1 className="page-title">{communityContent.title}</h1>
          <p className="page-intro">{communityContent.intro}</p>
        </header>

        <div className="community-blocks">
          {communityContent.blocks.map((block, index) => (
            <div key={index} className="community-block">
              <h2 className="community-block-title">{block.title}</h2>
              <p className="community-block-text">{block.text}</p>
            </div>
          ))}
        </div>
      </div>
      <FooterNav />
    </div>
  );
};

export default CommunityPage;
