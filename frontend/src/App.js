import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import PhilosophyPage from './pages/PhilosophyPage';
import ApproachPage from './pages/ApproachPage';
import CommunityPage from './pages/CommunityPage';
import QuestionnairePage from './pages/QuestionnairePage';
import PartnersPage from './pages/PartnersPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';

// Analytics placeholder (consent-ready)
const initAnalytics = () => {
  // Google Analytics placeholder
  // Will be activated post soft-launch with tracking IDs
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
  }
};

function App() {
  React.useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/philosophy" element={<PhilosophyPage />} />
          <Route path="/approach" element={<ApproachPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
