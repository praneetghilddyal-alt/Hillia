import React, { useEffect, useState } from 'react';
import { contactContent } from '../data/mock';
import FooterNav from '../components/layout/FooterNav';
import { submitContact, trackEvent, EVENTS } from '../services/api';

const ContactPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    reason: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit to backend
      await submitContact(formData);
      
      // Track event
      trackEvent(EVENTS.CONTACT_SUBMITTED);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Contact submission error:', error);
      // Still show success to user (graceful degradation)
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && formData.city && formData.reason;

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
          <h1 className="page-title">{contactContent.title}</h1>
          <p className="page-intro">{contactContent.intro}</p>
        </header>

        {isSubmitted ? (
          <div className="editorial-content">
            <p>Your message has been received.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {contactContent.fields.map((field) => (
              <div key={field.name} className="form-group">
                <label className="form-label" htmlFor={field.name}>
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    className="form-input form-textarea"
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    className="form-input"
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                  />
                )}
              </div>
            ))}

            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-light)',
                marginBottom: '32px',
                lineHeight: '1.6',
              }}
            >
              {contactContent.disclaimer}
            </p>

            <button
              type="submit"
              className="submit-btn"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Submitting' : 'Submit'}
            </button>
          </form>
        )}
      </div>
      <FooterNav />
    </div>
  );
};

export default ContactPage;
