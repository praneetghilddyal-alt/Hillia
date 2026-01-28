import React, { useEffect, useState } from 'react';
import FooterNav from '../components/layout/FooterNav';
import { submitContact, trackEvent, EVENTS } from '../services/api';

const ContactPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    reason: '',
    preferredContact: '', // '', 'email', 'phone'
    email: '',
    phone: '',
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
      // Prepare submission data
      const submissionData = {
        name: formData.name,
        city: '', // Not required anymore
        reason: formData.reason,
        preferred_contact: formData.preferredContact || null,
        email: formData.email || null,
        phone: formData.phone || null,
      };

      await submitContact(submissionData);
      trackEvent(EVENTS.CONTACT_SUBMITTED);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Contact submission error:', error);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only name and reason required
  const isFormValid = formData.name && formData.reason;

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
          <h1 className="page-title">Contact</h1>
          <p className="page-intro">Reach out only if there is genuine intent.</p>
        </header>

        {isSubmitted ? (
          <div className="editorial-content">
            <p>Your message has been received.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Name - Required */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Reason - Required */}
            <div className="form-group">
              <label className="form-label" htmlFor="reason">
                Reason for reaching out
              </label>
              <textarea
                id="reason"
                name="reason"
                className="form-input form-textarea"
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>

            {/* Preferred means of communication - Optional */}
            <div className="form-group">
              <label className="form-label" htmlFor="preferredContact">
                Preferred means of communication
                <span style={{ fontWeight: 400, color: 'var(--text-light)', marginLeft: '8px' }}>
                  (optional)
                </span>
              </label>
              <div className="contact-options">
                <button
                  type="button"
                  className={`contact-option ${formData.preferredContact === '' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, preferredContact: '', email: '', phone: '' }))}
                >
                  No preference
                </button>
                <button
                  type="button"
                  className={`contact-option ${formData.preferredContact === 'email' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, preferredContact: 'email', phone: '' }))}
                >
                  Email
                </button>
                <button
                  type="button"
                  className={`contact-option ${formData.preferredContact === 'phone' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, preferredContact: 'phone', email: '' }))}
                >
                  Phone
                </button>
              </div>
            </div>

            {/* Email field - shown only if email selected */}
            {formData.preferredContact === 'email' && (
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email
                  <span style={{ fontWeight: 400, color: 'var(--text-light)', marginLeft: '8px' }}>
                    (optional)
                  </span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Phone field - shown only if phone selected */}
            {formData.preferredContact === 'phone' && (
              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Phone
                  <span style={{ fontWeight: 400, color: 'var(--text-light)', marginLeft: '8px' }}>
                    (optional)
                  </span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            )}

            <div style={{ marginTop: '48px' }}>
              <button
                type="submit"
                className="submit-btn"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? 'Submitting' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
      <FooterNav />
    </div>
  );
};

export default ContactPage;
