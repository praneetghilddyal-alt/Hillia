import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionnaireContent, STORAGE_KEYS, siteConfig } from '../data/mock';
import { submitQuestionnaire, trackEvent, EVENTS } from '../services/api';

const QuestionnairePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showContactCapture, setShowContactCapture] = useState(false);
  const [wantsContact, setWantsContact] = useState(null);
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', mobile: '' });

  // Calculate all questions flat
  const allQuestions = questionnaireContent.sections.flatMap((section) =>
    section.questions.map((q) => ({ ...q, sectionTitle: section.title }))
  );

  const totalQuestions = allQuestions.length;
  const currentFlatIndex = questionnaireContent.sections
    .slice(0, currentSectionIndex)
    .reduce((acc, section) => acc + section.questions.length, 0) + currentQuestionIndex;

  const currentSection = questionnaireContent.sections[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];

  // Progress includes contact capture step
  const totalSteps = totalQuestions + 1;
  const currentStep = showContactCapture ? totalQuestions : currentFlatIndex;
  const progress = isCompleted ? 100 : (currentStep / totalSteps) * 100;

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Load saved progress
    const savedResponses = localStorage.getItem(STORAGE_KEYS.QUESTIONNAIRE_RESPONSES);
    const savedProgress = localStorage.getItem(STORAGE_KEYS.QUESTIONNAIRE_PROGRESS);

    if (savedResponses) {
      const parsed = JSON.parse(savedResponses);
      setResponses(parsed);
      if (parsed.contactInfo) {
        setContactInfo(parsed.contactInfo);
      }
      if (parsed.wantsContact !== undefined) {
        setWantsContact(parsed.wantsContact);
      }
    }
    if (savedProgress) {
      const { sectionIndex, questionIndex, completed, atContactCapture } = JSON.parse(savedProgress);
      if (completed) {
        setIsCompleted(true);
        setShowLanding(false);
      } else if (atContactCapture) {
        setShowContactCapture(true);
        setShowLanding(false);
      } else if (sectionIndex !== undefined) {
        setCurrentSectionIndex(sectionIndex);
        setCurrentQuestionIndex(questionIndex);
      }
    }

    return () => clearTimeout(timer);
  }, []);

  const saveProgress = useCallback((sectionIdx, questionIdx, completed = false, atContactCapture = false) => {
    localStorage.setItem(
      STORAGE_KEYS.QUESTIONNAIRE_PROGRESS,
      JSON.stringify({
        sectionIndex: sectionIdx,
        questionIndex: questionIdx,
        completed,
        atContactCapture,
      })
    );
  }, []);

  const saveResponses = useCallback((newResponses) => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONNAIRE_RESPONSES, JSON.stringify(newResponses));
  }, []);

  const handleOptionSelect = (option) => {
    const newResponses = {
      ...responses,
      [currentQuestion.id]: option,
    };
    setResponses(newResponses);
    saveResponses(newResponses);

    // Auto-advance after selection
    setTimeout(() => handleNext(), 300);
  };

  const handleTextInput = (value) => {
    const newResponses = {
      ...responses,
      [currentQuestion.id]: value,
    };
    setResponses(newResponses);
    saveResponses(newResponses);
  };

  const handleNext = () => {
    const isLastQuestionInSection = currentQuestionIndex >= currentSection.questions.length - 1;
    const isLastSection = currentSectionIndex >= questionnaireContent.sections.length - 1;

    if (isLastQuestionInSection) {
      if (isLastSection) {
        // Go to contact capture instead of completing
        setShowContactCapture(true);
        saveProgress(currentSectionIndex, currentQuestionIndex, false, true);
      } else {
        // Move to next section
        setCurrentSectionIndex((prev) => prev + 1);
        setCurrentQuestionIndex(0);
        saveProgress(currentSectionIndex + 1, 0);
      }
    } else {
      // Move to next question
      setCurrentQuestionIndex((prev) => prev + 1);
      saveProgress(currentSectionIndex, currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (showContactCapture) {
      // Go back to last question
      setShowContactCapture(false);
      const lastSection = questionnaireContent.sections[questionnaireContent.sections.length - 1];
      setCurrentSectionIndex(questionnaireContent.sections.length - 1);
      setCurrentQuestionIndex(lastSection.questions.length - 1);
      saveProgress(questionnaireContent.sections.length - 1, lastSection.questions.length - 1);
      return;
    }

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      saveProgress(currentSectionIndex, currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      const prevSection = questionnaireContent.sections[currentSectionIndex - 1];
      setCurrentSectionIndex((prev) => prev - 1);
      setCurrentQuestionIndex(prevSection.questions.length - 1);
      saveProgress(currentSectionIndex - 1, prevSection.questions.length - 1);
    }
  };

  const handleBegin = () => {
    setShowLanding(false);
  };

  const handleContactChoice = (wants) => {
    setWantsContact(wants);
    const newResponses = { ...responses, wantsContact: wants };
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

  const handleSubmit = () => {
    setIsCompleted(true);
    saveProgress(currentSectionIndex, currentQuestionIndex, true, false);
  };

  const canGoBack = currentSectionIndex > 0 || currentQuestionIndex > 0 || showContactCapture;
  const hasCurrentResponse = responses[currentQuestion?.id];

  // Can submit if: chose anonymous OR provided at least name and email
  const canSubmit = wantsContact === false || 
    (wantsContact === true && contactInfo.name && contactInfo.email);

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
          <div style={{ marginBottom: '48px' }}>
            <span
              className="font-headline"
              style={{
                fontSize: '18px',
                letterSpacing: '0.15em',
                color: 'var(--text-light)',
              }}
            >
              {siteConfig.name}
            </span>
          </div>

          <h1 className="page-title" style={{ marginBottom: '24px' }}>
            {questionnaireContent.title}
          </h1>
          <p className="page-intro" style={{ marginBottom: '60px', maxWidth: '480px' }}>
            {questionnaireContent.intro}
          </p>

          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: '1.8',
              marginBottom: '48px',
              maxWidth: '480px',
            }}
          >
            Responses are saved. You may return later.
          </p>

          <button className="entry-cta" onClick={handleBegin}>
            Begin
          </button>
        </div>
      </div>
    );
  }

  // Completion screen
  if (isCompleted) {
    return (
      <div className="page">
        <div className="questionnaire-progress">
          <div className="questionnaire-progress-bar" style={{ width: '100%' }} />
        </div>
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
          <h1 className="page-title" style={{ marginBottom: '32px' }}>
            {questionnaireContent.completion.title}
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              lineHeight: '1.8',
              maxWidth: '480px',
            }}
          >
            {wantsContact 
              ? questionnaireContent.completion.message
              : 'Your anonymous responses have been received.'
            }
          </p>

          <div style={{ marginTop: '60px' }}>
            <button
              className="questionnaire-nav-btn"
              onClick={() => navigate('/philosophy')}
              style={{ fontSize: '13px' }}
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Contact capture screen
  if (showContactCapture) {
    return (
      <div className="page">
        <div className="questionnaire-progress">
          <div
            className="questionnaire-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div
          className="questionnaire-section"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.4s ease',
            maxWidth: '720px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              marginBottom: '32px',
              fontSize: '12px',
              color: 'var(--text-light)',
              letterSpacing: '0.05em',
            }}
          >
            Contact
          </div>

          {wantsContact === null ? (
            <>
              <h2 className="questionnaire-question">
                If you wish to be contacted, please allow data capture and give your permission.
              </h2>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.8',
                  marginBottom: '48px',
                  maxWidth: '520px',
                }}
              >
                Otherwise, your responses remain anonymous.
              </p>

              <div className="questionnaire-options">
                <button
                  className="questionnaire-option"
                  onClick={() => handleContactChoice(true)}
                >
                  I consent to being contacted
                </button>
                <button
                  className="questionnaire-option"
                  onClick={() => handleContactChoice(false)}
                >
                  Remain anonymous
                </button>
              </div>
            </>
          ) : wantsContact === false ? (
            <>
              <h2 className="questionnaire-question">
                Your responses will be submitted anonymously.
              </h2>

              <div style={{ marginTop: '48px' }}>
                <button
                  className="submit-btn"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="questionnaire-question">
                Your details
              </h2>

              <div style={{ maxWidth: '400px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Name</label>
                  <input
                    type="text"
                    id="contact-name"
                    className="form-input"
                    value={contactInfo.name}
                    onChange={(e) => handleContactInfoChange('name', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Email</label>
                  <input
                    type="email"
                    id="contact-email"
                    className="form-input"
                    value={contactInfo.email}
                    onChange={(e) => handleContactInfoChange('email', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-mobile">Mobile</label>
                  <input
                    type="tel"
                    id="contact-mobile"
                    className="form-input"
                    value={contactInfo.mobile}
                    onChange={(e) => handleContactInfoChange('mobile', e.target.value)}
                  />
                </div>

                <div style={{ marginTop: '48px' }}>
                  <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="questionnaire-nav">
            <button
              className="questionnaire-nav-btn"
              onClick={handleBack}
            >
              Back
            </button>

            {wantsContact !== null && wantsContact === true && (
              <button
                className="questionnaire-nav-btn"
                onClick={() => setWantsContact(null)}
              >
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
      {/* Progress bar */}
      <div className="questionnaire-progress">
        <div
          className="questionnaire-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className="questionnaire-section"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s ease',
          maxWidth: '720px',
          margin: '0 auto',
        }}
      >
        {/* Section indicator */}
        <div
          style={{
            marginBottom: '32px',
            fontSize: '12px',
            color: 'var(--text-light)',
            letterSpacing: '0.05em',
          }}
        >
          {currentSection.title}
        </div>

        {/* Question */}
        <h2 className="questionnaire-question">{currentQuestion.question}</h2>

        {/* Options or Text Input */}
        {currentQuestion.type === 'text' ? (
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
        ) : (
          <div className="questionnaire-options">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`questionnaire-option ${
                  responses[currentQuestion.id] === option ? 'selected' : ''
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="questionnaire-nav">
          <button
            className="questionnaire-nav-btn"
            onClick={handleBack}
            disabled={!canGoBack}
          >
            Back
          </button>

          {currentQuestion.type === 'text' && (
            <button
              className="questionnaire-nav-btn"
              onClick={handleNext}
              disabled={!hasCurrentResponse}
              style={{
                color: hasCurrentResponse ? 'var(--text-primary)' : undefined,
              }}
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
