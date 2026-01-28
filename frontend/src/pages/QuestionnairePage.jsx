import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { questionnaireContent, STORAGE_KEYS, siteConfig } from '../data/mock';
import { submitQuestionnaire, trackEvent, EVENTS } from '../services/api';

const QuestionnairePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showContactSection, setShowContactSection] = useState(false);
  const [wantsContact, setWantsContact] = useState(null);
  const [preferredContact, setPreferredContact] = useState('');
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '' });

  const sections = questionnaireContent.sections;
  const currentSection = sections[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];

  // Calculate total questions for progress
  const totalQuestions = sections.reduce((acc, section) => acc + section.questions.length, 0) + 1; // +1 for contact section
  const currentFlatIndex = sections
    .slice(0, currentSectionIndex)
    .reduce((acc, section) => acc + section.questions.length, 0) + currentQuestionIndex;
  
  const progress = isCompleted ? 100 : showContactSection ? 95 : ((currentFlatIndex) / totalQuestions) * 100;

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Check for reset parameter
    if (searchParams.get('reset') === 'true') {
      localStorage.removeItem(STORAGE_KEYS.QUESTIONNAIRE_RESPONSES);
      localStorage.removeItem(STORAGE_KEYS.QUESTIONNAIRE_PROGRESS);
      // Remove the reset param from URL
      navigate('/questionnaire', { replace: true });
      return () => clearTimeout(timer);
    }

    // Load saved progress
    const savedResponses = localStorage.getItem(STORAGE_KEYS.QUESTIONNAIRE_RESPONSES);
    const savedProgress = localStorage.getItem(STORAGE_KEYS.QUESTIONNAIRE_PROGRESS);

    if (savedResponses) {
      const parsed = JSON.parse(savedResponses);
      setResponses(parsed);
      if (parsed.contactInfo) setContactInfo(parsed.contactInfo);
      if (parsed.wantsContact !== undefined) setWantsContact(parsed.wantsContact);
      if (parsed.preferredContact) setPreferredContact(parsed.preferredContact);
    }
    if (savedProgress) {
      const { sectionIndex, questionIndex, completed, atContactSection } = JSON.parse(savedProgress);
      if (completed) {
        setIsCompleted(true);
        setShowLanding(false);
      } else if (atContactSection) {
        setShowContactSection(true);
        setShowLanding(false);
      } else if (sectionIndex !== undefined && (sectionIndex > 0 || questionIndex > 0)) {
        setCurrentSectionIndex(sectionIndex);
        setCurrentQuestionIndex(questionIndex);
        setShowLanding(false);
      }
    }

    return () => clearTimeout(timer);
  }, []);

  const saveProgress = useCallback((sectionIdx, questionIdx, completed = false, atContactSection = false) => {
    localStorage.setItem(
      STORAGE_KEYS.QUESTIONNAIRE_PROGRESS,
      JSON.stringify({ sectionIndex: sectionIdx, questionIndex: questionIdx, completed, atContactSection })
    );
  }, []);

  const saveResponses = useCallback((newResponses) => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONNAIRE_RESPONSES, JSON.stringify(newResponses));
  }, []);

  const handleSingleSelect = (option) => {
    const newResponses = { ...responses, [currentQuestion.id]: option };
    setResponses(newResponses);
    saveResponses(newResponses);
    // Auto-advance after short delay
    setTimeout(() => handleNext(), 250);
  };

  const handleMultiSelect = (option) => {
    const current = responses[currentQuestion.id] || [];
    let updated;
    if (current.includes(option)) {
      updated = current.filter(o => o !== option);
    } else if (current.length < (currentQuestion.maxSelect || 10)) {
      updated = [...current, option];
    } else {
      return; // Max reached
    }
    const newResponses = { ...responses, [currentQuestion.id]: updated };
    setResponses(newResponses);
    saveResponses(newResponses);
  };

  const handleMatrixSelect = (row, col) => {
    const current = responses[currentQuestion.id] || {};
    const updated = { ...current, [row]: col };
    const newResponses = { ...responses, [currentQuestion.id]: updated };
    setResponses(newResponses);
    saveResponses(newResponses);
  };

  const handleTextInput = (value) => {
    const newResponses = { ...responses, [currentQuestion.id]: value };
    setResponses(newResponses);
    saveResponses(newResponses);
  };

  const handleNext = () => {
    const isLastQuestionInSection = currentQuestionIndex >= currentSection.questions.length - 1;
    const isLastSection = currentSectionIndex >= sections.length - 1;

    if (isLastQuestionInSection) {
      if (isLastSection) {
        setShowContactSection(true);
        saveProgress(currentSectionIndex, currentQuestionIndex, false, true);
      } else {
        setCurrentSectionIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
        saveProgress(currentSectionIndex + 1, 0);
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      saveProgress(currentSectionIndex, currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (showContactSection) {
      setShowContactSection(false);
      const lastSection = sections[sections.length - 1];
      setCurrentSectionIndex(sections.length - 1);
      setCurrentQuestionIndex(lastSection.questions.length - 1);
      saveProgress(sections.length - 1, lastSection.questions.length - 1);
      return;
    }

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      saveProgress(currentSectionIndex, currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      const prevSection = sections[currentSectionIndex - 1];
      setCurrentSectionIndex(prev => prev - 1);
      setCurrentQuestionIndex(prevSection.questions.length - 1);
      saveProgress(currentSectionIndex - 1, prevSection.questions.length - 1);
    }
  };

  const handleBegin = () => {
    setShowLanding(false);
    trackEvent(EVENTS.QUESTIONNAIRE_STARTED);
  };

  const handleContactConsent = (wants) => {
    setWantsContact(wants);
    const newResponses = { ...responses, wantsContact: wants };
    setResponses(newResponses);
    saveResponses(newResponses);
  };

  const handlePreferredContact = (method) => {
    setPreferredContact(method);
    const newResponses = { ...responses, preferredContact: method };
    setResponses(newResponses);
    saveResponses(newResponses);
  };

  const handleContactInfoChange = (field, value) => {
    const newContactInfo = { ...contactInfo, [field]: value };
    setContactInfo(newContactInfo);
    const newResponses = { ...responses, contactInfo: newContactInfo };
    setResponses(newResponses);
    saveResponses(newResponses);
  };

  const handleSubmit = async () => {
    const sections_data = {};
    const free_text = {};
    
    questionnaireContent.sections.forEach(section => {
      sections_data[section.id] = {};
      section.questions.forEach(q => {
        if (responses[q.id]) {
          if (q.type === 'text') {
            free_text[q.id] = responses[q.id];
          } else {
            sections_data[section.id][q.id] = responses[q.id];
          }
        }
      });
    });

    await submitQuestionnaire({
      sections: sections_data,
      free_text,
      contact_info: wantsContact ? { ...contactInfo, preferred_contact: preferredContact } : null,
      wants_contact: wantsContact === true,
    });

    trackEvent(EVENTS.QUESTIONNAIRE_COMPLETED);
    setIsCompleted(true);
    saveProgress(currentSectionIndex, currentQuestionIndex, true, false);
  };

  const canGoBack = currentSectionIndex > 0 || currentQuestionIndex > 0 || showContactSection;
  
  // Check if current question has response (for Continue button)
  const hasCurrentResponse = () => {
    if (!currentQuestion) return false;
    const resp = responses[currentQuestion.id];
    if (currentQuestion.type === 'matrix') {
      return resp && Object.keys(resp).length === currentQuestion.rows.length;
    }
    if (currentQuestion.type === 'multiselect') {
      return resp && resp.length > 0;
    }
    if (currentQuestion.optional) return true;
    return !!resp;
  };

  // Landing screen
  if (showLanding && !isCompleted) {
    return (
      <div className="page">
        <div
          className="page-content"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '80px 40px',
          }}
        >
          <div style={{ marginBottom: '32px' }}>
            <span className="font-headline" style={{ fontSize: '16px', letterSpacing: '0.15em', color: 'var(--text-light)' }}>
              {siteConfig.name}
            </span>
          </div>

          <h1 className="page-title" style={{ marginBottom: '8px' }}>{questionnaireContent.title}</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '48px', letterSpacing: '0.02em' }}>
            {questionnaireContent.subtitle}
          </p>

          <div style={{ maxWidth: '520px', marginBottom: '48px' }}>
            {questionnaireContent.introNote.paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.8', marginBottom: '12px' }}>
                {p}
              </p>
            ))}

            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.8', marginTop: '24px', marginBottom: '8px' }}>
              Responses are used for:
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {questionnaireContent.introNote.usedFor.map((item, i) => (
                <li key={i} style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  {item}
                </li>
              ))}
            </ul>

            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.8', marginTop: '16px' }}>
              {questionnaireContent.introNote.disclaimer}
            </p>
          </div>

          <button className="entry-cta" onClick={handleBegin}>Begin</button>
        </div>
      </div>
    );
  }

  // Completion screen
  if (isCompleted) {
    const handleStartOver = () => {
      localStorage.removeItem(STORAGE_KEYS.QUESTIONNAIRE_RESPONSES);
      localStorage.removeItem(STORAGE_KEYS.QUESTIONNAIRE_PROGRESS);
      setResponses({});
      setCurrentSectionIndex(0);
      setCurrentQuestionIndex(0);
      setIsCompleted(false);
      setShowLanding(true);
      setShowContactSection(false);
      setWantsContact(null);
      setPreferredContact('');
      setContactInfo({ email: '', phone: '' });
    };

    return (
      <div className="page">
        <div className="questionnaire-progress">
          <div className="questionnaire-progress-bar" style={{ width: '100%' }} />
        </div>
        <div
          className="page-content"
          style={{
            opacity: isVisible ? 1 : 0,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '80px 40px',
          }}
        >
          <h1 className="page-title" style={{ marginBottom: '32px' }}>{questionnaireContent.completion.title}</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.8', maxWidth: '480px' }}>
            {wantsContact ? questionnaireContent.completion.message : questionnaireContent.completion.anonymousMessage}
          </p>
          <div style={{ marginTop: '60px', display: 'flex', gap: '24px' }}>
            <button className="questionnaire-nav-btn" onClick={() => navigate('/philosophy')} style={{ fontSize: '13px' }}>
              Exit
            </button>
            <button className="questionnaire-nav-btn" onClick={handleStartOver} style={{ fontSize: '13px' }}>
              Start over
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Contact section
  if (showContactSection) {
    const contactSec = questionnaireContent.contactSection;
    return (
      <div className="page">
        <div className="questionnaire-progress">
          <div className="questionnaire-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="questionnaire-section" style={{ opacity: isVisible ? 1 : 0, maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px', fontSize: '12px', color: 'var(--text-light)', letterSpacing: '0.05em' }}>
            {contactSec.label} — {contactSec.title}
          </div>

          {wantsContact === null ? (
            <>
              <h2 className="questionnaire-question">{contactSec.consentQuestion.question}</h2>
              <div className="questionnaire-options">
                {contactSec.consentQuestion.options.map((opt, i) => (
                  <button key={i} className="questionnaire-option" onClick={() => handleContactConsent(opt === 'Yes')}>
                    {opt}
                  </button>
                ))}
              </div>
            </>
          ) : wantsContact === false ? (
            <>
              <h2 className="questionnaire-question">Your responses will be submitted anonymously.</h2>
              <div style={{ marginTop: '48px' }}>
                <button className="submit-btn" onClick={handleSubmit}>Submit</button>
              </div>
            </>
          ) : (
            <>
              <h2 className="questionnaire-question">{contactSec.preferredContact.question}</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '24px' }}>(optional)</p>
              
              <div className="questionnaire-options" style={{ marginBottom: '32px' }}>
                {contactSec.preferredContact.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`questionnaire-option ${preferredContact === opt ? 'selected' : ''}`}
                    onClick={() => handlePreferredContact(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {(preferredContact === 'Email' || preferredContact === 'No preference') && (
                <div className="form-group">
                  <label className="form-label">Email <span style={{ color: 'var(--text-light)' }}>(optional)</span></label>
                  <input
                    type="email"
                    className="form-input"
                    value={contactInfo.email}
                    onChange={(e) => handleContactInfoChange('email', e.target.value)}
                  />
                </div>
              )}

              {(preferredContact === 'Phone' || preferredContact === 'WhatsApp' || preferredContact === 'No preference') && (
                <div className="form-group">
                  <label className="form-label">Phone <span style={{ color: 'var(--text-light)' }}>(optional)</span></label>
                  <input
                    type="tel"
                    className="form-input"
                    value={contactInfo.phone}
                    onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                  />
                </div>
              )}

              <div style={{ marginTop: '48px' }}>
                <button className="submit-btn" onClick={handleSubmit}>Submit</button>
              </div>
            </>
          )}

          <div className="questionnaire-nav">
            <button className="questionnaire-nav-btn" onClick={handleBack}>Back</button>
            {wantsContact === true && (
              <button className="questionnaire-nav-btn" onClick={() => { setWantsContact(null); setPreferredContact(''); }}>
                Change choice
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Question screens
  return (
    <div className="page">
      <div className="questionnaire-progress">
        <div className="questionnaire-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="questionnaire-section" style={{ opacity: isVisible ? 1 : 0, maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px', fontSize: '12px', color: 'var(--text-light)', letterSpacing: '0.05em' }}>
          {currentSection.label} — {currentSection.title}
        </div>

        <h2 className="questionnaire-question">
          {currentQuestion.question}
          {currentQuestion.optional && <span style={{ fontSize: '14px', color: 'var(--text-light)', marginLeft: '8px' }}>(optional)</span>}
        </h2>

        {currentQuestion.type === 'single' && (
          <div className="questionnaire-options">
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                className={`questionnaire-option ${responses[currentQuestion.id] === opt ? 'selected' : ''}`}
                onClick={() => handleSingleSelect(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'multiselect' && (
          <>
            <p style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '24px' }}>
              Select up to {currentQuestion.maxSelect}
            </p>
            <div className="questionnaire-options">
              {currentQuestion.options.map((opt, i) => {
                const selected = (responses[currentQuestion.id] || []).includes(opt);
                return (
                  <button
                    key={i}
                    className={`questionnaire-option ${selected ? 'selected' : ''}`}
                    onClick={() => handleMultiSelect(opt)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {currentQuestion.type === 'matrix' && (
          <div className="matrix-question">
            <div className="matrix-header">
              <div className="matrix-row-label"></div>
              {currentQuestion.columns.map((col, i) => (
                <div key={i} className="matrix-col-header">{col}</div>
              ))}
            </div>
            {currentQuestion.rows.map((row, ri) => (
              <div key={ri} className="matrix-row">
                <div className="matrix-row-label">{row}</div>
                {currentQuestion.columns.map((col, ci) => {
                  const selected = (responses[currentQuestion.id] || {})[row] === col;
                  return (
                    <div key={ci} className="matrix-cell">
                      <button
                        className={`matrix-option ${selected ? 'selected' : ''}`}
                        onClick={() => handleMatrixSelect(row, col)}
                        aria-label={`${row}: ${col}`}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {currentQuestion.type === 'text' && (
          <div style={{ maxWidth: '480px' }}>
            <input
              type="text"
              className="form-input"
              placeholder={currentQuestion.placeholder}
              value={responses[currentQuestion.id] || ''}
              onChange={(e) => handleTextInput(e.target.value)}
              autoFocus
            />
          </div>
        )}

        <div className="questionnaire-nav">
          <button className="questionnaire-nav-btn" onClick={handleBack} disabled={!canGoBack}>
            Back
          </button>
          {(currentQuestion.type === 'text' || currentQuestion.type === 'multiselect' || currentQuestion.type === 'matrix') && (
            <button
              className="questionnaire-nav-btn"
              onClick={handleNext}
              disabled={!hasCurrentResponse() && !currentQuestion.optional}
              style={{ color: hasCurrentResponse() || currentQuestion.optional ? 'var(--text-primary)' : undefined }}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePage;
