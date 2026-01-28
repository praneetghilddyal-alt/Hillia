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
          <p className="page-intro" style={{ lineHeight: '1.9' }}>
            {partnersContent.intro}
          </p>
        </header>

        <div className="partners-categories">
          {partnersContent.categories.map((category, index) => (
            <div key={index} className="partner-category">
              <h2 className="partner-category-title">{category.title}</h2>
              <p className="partner-category-description">{category.description}</p>
              <p className="partner-category-disclaimer">{category.disclaimer}</p>
            </div>
          ))}
        </div>

        <div className="section-divider" style={{ margin: '60px 0' }} />

        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: '1.8',
            marginBottom: '24px',
          }}
        >
          {partnersContent.independenceClause}
        </p>

        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-primary)',
            lineHeight: '1.8',
          }}
        >
          {partnersContent.closing}
        </p>
      </div>
      <FooterNav />
    </div>
  );
};

export default PartnersPage;
