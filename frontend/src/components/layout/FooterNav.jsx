import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navigationLinks } from '../../data/mock';

const FooterNav = () => {
  const location = useLocation();

  // Don't show on homepage
  if (location.pathname === '/') {
    return null;
  }

  return (
    <footer className="footer-nav">
      <nav className="footer-nav-links">
        {navigationLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="footer-nav-link"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <span className="footer-imprint">HILLIA</span>
    </footer>
  );
};

export default FooterNav;
