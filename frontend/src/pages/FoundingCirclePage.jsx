import React, { useEffect, useState } from 'react';
import FooterNav from '../components/layout/FooterNav';

const foundingCircleContent = {
  title: 'Founding Circle',
  subtitle: 'Ethics & Stewardship Charter',
  purpose: 'The Founding Circle exists to protect intent. Members are invited for alignment with how decisions are made, not for capital, influence, or scale. Participation is a responsibility, not a privilege.',
  principles: [
    {
      title: 'Community First',
      text: 'All decisions prioritise long-term community coherence, spatial integrity, and behavioural compatibility over short-term financial optimisation or rapid expansion. Financial viability is required. Yield maximisation is not the governing objective.',
    },
    {
      title: 'Restraint as Principle',
      text: 'Restraint is an ethical position. This applies to scale, promotion, disclosure, data usage, and growth velocity. Not everything that can be built, sold, or scaled should be.',
    },
    {
      title: 'Data Responsibility',
      text: 'Any data accessed through Hillia is confidential, non-transferable, and used only for alignment, design intelligence, and governance. Data is not leverage. Insight does not confer entitlement.',
    },
    {
      title: 'Independence & Non-Extraction',
      text: 'Founding Circle members do not use Hillia for brokerage, solicitation, prospecting, or personal commercial advantage. Alignment does not imply access.',
    },
    {
      title: 'Decision Conduct',
      text: 'Where disagreement arises, decisions favour long-term integrity over speed. Deliberation is preferred. Silence is acceptable. Pressure is not. Consensus is ideal. Dissent may be recorded without penalty.',
    },
    {
      title: 'Visibility & Disclosure',
      text: 'Membership does not guarantee public attribution and may remain private by default. Hillia retains discretion over all disclosures.',
    },
    {
      title: 'Exit',
      text: 'Members may step back at any time without justification. Confidentiality obligations survive withdrawal. Alignment cannot be compelled.',
    },
  ],
  closing: 'The Founding Circle exists to ensure Hillia remains thoughtful rather than impressive, coherent rather than expansive, and durable rather than loud. If these principles cannot be upheld, participation should be reconsidered.',
};

const FoundingCirclePage = () => {
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
          <div
            style={{
              fontSize: '12px',
              letterSpacing: '0.15em',
              color: 'var(--text-light)',
              marginBottom: '16px',
              fontFamily: 'Cormorant Garamond, Georgia, serif',
            }}
          >
            HILLIA
          </div>
          <h1 className="page-title">{foundingCircleContent.title}</h1>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              letterSpacing: '0.05em',
              marginTop: '8px',
            }}
          >
            {foundingCircleContent.subtitle}
          </p>
        </header>

        {/* Purpose */}
        <div style={{ marginBottom: '60px' }}>
          <h2
            className="community-block-title"
            style={{ marginBottom: '16px' }}
          >
            Purpose
          </h2>
          <p className="editorial-content" style={{ margin: 0 }}>
            {foundingCircleContent.purpose}
          </p>
        </div>

        {/* Principles */}
        <div className="founding-principles">
          {foundingCircleContent.principles.map((principle, index) => (
            <div key={index} className="community-block">
              <h2 className="community-block-title">{principle.title}</h2>
              <p className="community-block-text">{principle.text}</p>
            </div>
          ))}
        </div>

        <div className="section-divider" style={{ margin: '60px 0' }} />

        {/* Closing */}
        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-primary)',
            lineHeight: '1.9',
          }}
        >
          {foundingCircleContent.closing}
        </p>
      </div>
      <FooterNav />
    </div>
  );
};

export default FoundingCirclePage;
