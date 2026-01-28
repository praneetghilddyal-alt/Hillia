import React, { useEffect, useState } from 'react';
import { partnersContent } from '../data/mock';
import FooterNav from '../components/layout/FooterNav';

const PartnersPage = () => {
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
          <h1 className="page-title">{partnersContent.title}</h1>
          <p className="page-intro">{partnersContent.intro}</p>
        </header>

        <div className="partners-list">
          {partnersContent.partners.map((partner, index) => (
            <div key={index} className="partner-item">
              <h3 className="partner-name">{partner.name}</h3>
              <p className="partner-role">{partner.role}</p>
            </div>
          ))}
        </div>
      </div>
      <FooterNav />
    </div>
  );
};

export default PartnersPage;
